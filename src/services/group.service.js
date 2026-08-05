const { Group, User, Expense } = require('../models');


const createGroup = async ({ name, description }) => {
  const createdGroup = await Group.create({
    name: name.trim(),
    description: description,
    members: []
  });
  return createdGroup;
};

const getGroups = async () => {
  const groupsList = await Group.find().sort({ createdAt: -1 });

  const fullGroups = await Promise.all(
    groupsList.map(async (group) => {
      const expenses = await Expense.find({ groupId: group._id }).sort({ createdAt: -1 });
      const groupObj = group.toJSON();
      groupObj.expenses = expenses;
      return groupObj;
    })
  );

  return fullGroups;
};


const getGroupById = async (id) => {
  const groupItem = await Group.findById(id);
  if (!groupItem) {
    return null;
  }

  const expenses = await Expense.find({ groupId: groupItem._id }).sort({ createdAt: -1 });

  const groupObj = groupItem.toJSON();
  groupObj.expenses = expenses;

  return groupObj;
};


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
