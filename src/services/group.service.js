const { Group, User, Expense } = require('../models');

// Calculate member balances for a group using stored expense splits
const calculateGroupBalances = (groupObj, expenses) => {
  if (!groupObj.members || groupObj.members.length === 0) return groupObj;

  groupObj.members = groupObj.members.map((member) => {
    let balancePaisa = 0;
    const memberIdStr = String(member.id || member._id);
    const memberNameLower = member.name.toLowerCase();

    expenses.forEach((exp) => {
      const expPaisa = Math.round(exp.amount * 100);
      const isPayer = exp.paidByMemberId
        ? String(exp.paidByMemberId) === memberIdStr
        : exp.paidBy.toLowerCase() === memberNameLower;

      const isSettlement = exp.category === 'Settlement' || (exp.description && exp.description.toLowerCase().startsWith('settlement:'));

      if (isSettlement) {
        if (isPayer) {
          balancePaisa += expPaisa;
        } else if (exp.description.toLowerCase().includes(memberNameLower)) {
          balancePaisa -= expPaisa;
        }
      } else {
        let memberSharePaisa = 0;
        let isParticipant = false;

        if (exp.splits && Array.isArray(exp.splits) && exp.splits.length > 0) {
          const split = exp.splits.find(
            (s) => (s.memberId && String(s.memberId) === memberIdStr) || (s.memberName && s.memberName.toLowerCase() === memberNameLower)
          );
          if (split) {
            memberSharePaisa = Math.round(split.amount * 100);
            isParticipant = true;
          }
        } else {
          const totalMembersCount = groupObj.members.length;
          const basePaisa = Math.floor(expPaisa / totalMembersCount);
          const remainderPaisa = expPaisa - (basePaisa * totalMembersCount);
          const memberIndex = groupObj.members.findIndex((m) => String(m.id || m._id) === memberIdStr);
          memberSharePaisa = memberIndex === 0 ? basePaisa + remainderPaisa : basePaisa;
          isParticipant = true;
        }

        if (isPayer) {
          balancePaisa += (expPaisa - memberSharePaisa);
        } else if (isParticipant) {
          balancePaisa -= memberSharePaisa;
        }
      }
    });

    return {
      ...member,
      balance: balancePaisa / 100
    };
  });

  return groupObj;
};

// Create a new group
const createGroup = async ({ name, description }) => {
  const createdGroup = await Group.create({
    name: name.trim(),
    description: description ? description.trim() : '',
    members: []
  });
  return createdGroup;
};

// Get all groups with embedded members and expenses
const getGroups = async () => {
  const groupsList = await Group.find().sort({ createdAt: -1 });

  const fullGroups = await Promise.all(
    groupsList.map(async (group) => {
      const expenses = await Expense.find({ groupId: group._id }).sort({ createdAt: -1 });
      let groupObj = group.toJSON();
      groupObj.expenses = expenses;
      groupObj = calculateGroupBalances(groupObj, expenses);
      return groupObj;
    })
  );

  return fullGroups;
};

// Get group by ID with embedded members and expenses
const getGroupById = async (id) => {
  const groupItem = await Group.findById(id);
  if (!groupItem) {
    return null;
  }

  const expenses = await Expense.find({ groupId: groupItem._id }).sort({ createdAt: -1 });

  let groupObj = groupItem.toJSON();
  groupObj.expenses = expenses;
  groupObj = calculateGroupBalances(groupObj, expenses);

  return groupObj;
};

// Add an existing user as a member to a group's embedded members array
const addMemberToGroup = async ({ groupId, userId, name }) => {
  const group = await Group.findById(groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.statusCode = 404;
    throw error;
  }

  let memberName = name;
  let memberUserId = userId || null;

  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Selected user does not exist');
      error.statusCode = 404;
      throw error;
    }

    const isAlreadyMember = group.members.some(
      (m) => String(m.userId) === String(user._id) || m.name.toLowerCase() === user.name.toLowerCase()
    );

    if (isAlreadyMember) {
      const error = new Error(`${user.name} is already a member of this group`);
      error.statusCode = 400;
      throw error;
    }

    memberUserId = user._id;
    memberName = user.name;
  } else if (!memberName || !memberName.trim()) {
    const error = new Error('User selection or member name is required');
    error.statusCode = 400;
    throw error;
  }

  group.members.push({
    userId: memberUserId,
    name: memberName.trim()
  });

  await group.save();

  const addedMember = group.members[group.members.length - 1];
  return addedMember;
};

// Get registered users who are not yet members of the group
const getAvailableUsers = async (groupId) => {
  const group = await Group.findById(groupId);
  if (!group) {
    return [];
  }

  const existingUserIds = group.members.map((m) => String(m.userId));
  const existingNames = group.members.map((m) => m.name.toLowerCase());

  const allUsers = await User.find().sort({ name: 1 });

  const availableUsers = allUsers.filter(
    (user) => !existingUserIds.includes(String(user._id)) && !existingNames.includes(user.name.toLowerCase())
  );

  return availableUsers;
};

// Get all registered system users
const getAllUsers = async () => {
  const users = await User.find().sort({ name: 1 });
  return users;
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  addMemberToGroup,
  getAvailableUsers,
  getAllUsers
};
