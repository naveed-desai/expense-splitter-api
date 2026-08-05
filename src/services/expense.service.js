const { Expense, Group } = require('../models');

// Add a new expense and calculate member splits for selected members
const addExpense = async ({ groupId, description, amount, paidByMemberId, paidBy, splitMemberIds, date }) => {
  const group = await Group.findById(groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.statusCode = 404;
    throw error;
  }

  const numericAmount = parseFloat(amount);
  let payerName = paidBy;
  let payerMemberId = paidByMemberId || null;

  // Match payer from embedded group.members
  if (group.members && group.members.length > 0) {
    let matchedMember = null;
    if (paidByMemberId) {
      matchedMember = group.members.find((m) => String(m._id) === String(paidByMemberId) || String(m.userId) === String(paidByMemberId));
    }
    if (!matchedMember && paidBy) {
      matchedMember = group.members.find((m) => m.name.toLowerCase() === paidBy.trim().toLowerCase());
    }

    if (matchedMember) {
      payerName = matchedMember.name;
      payerMemberId = matchedMember._id;
    }
  }

  // Filter members participating in this split
  let targetMembers = group.members || [];
  if (splitMemberIds && Array.isArray(splitMemberIds) && splitMemberIds.length > 0) {
    const splitIdsStrings = splitMemberIds.map((id) => String(id));
    targetMembers = group.members.filter((m) =>
      splitIdsStrings.includes(String(m._id)) || (m.userId && splitIdsStrings.includes(String(m.userId)))
    );
  }

  if (targetMembers.length === 0) {
    targetMembers = group.members || [];
  }

  let splits = [];
  if (targetMembers.length > 0) {
    const totalPaisa = Math.round(numericAmount * 100);
    const basePaisa = Math.floor(totalPaisa / targetMembers.length);
    const remainderPaisa = totalPaisa - (basePaisa * targetMembers.length);

    splits = targetMembers.map((member, index) => {
      const memberPaisa = index === 0 ? basePaisa + remainderPaisa : basePaisa;
      return {
        memberId: member._id,
        memberName: member.name,
        amount: parseFloat((memberPaisa / 100).toFixed(2)),
        isSettled: false
      };
    });
  }

  const createdExpense = await Expense.create({
    groupId: group._id,
    description: description.trim(),
    amount: numericAmount,
    paidByMemberId: payerMemberId,
    paidBy: payerName ? payerName.trim() : 'Unknown',
    date: date || new Date().toISOString().split('T')[0],
    splits
  });

  return createdExpense;
};

// Record a settlement payment directly into Expenses collection
const recordSettlement = async ({ groupId, payerMemberId, payeeMemberId, payerName, payeeName, amount }) => {
  const group = await Group.findById(groupId);
  if (!group) {
    const error = new Error('Group not found');
    error.statusCode = 404;
    throw error;
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    const error = new Error('A valid positive settlement amount is required');
    error.statusCode = 400;
    throw error;
  }

  let finalPayerName = payerName;
  let finalPayeeName = payeeName;
  let resolvedPayerMemberId = payerMemberId || null;

  if (group.members && group.members.length > 0) {
    if (payerMemberId) {
      const payer = group.members.find((m) => String(m._id) === String(payerMemberId) || String(m.userId) === String(payerMemberId));
      if (payer) {
        finalPayerName = payer.name;
        resolvedPayerMemberId = payer._id;
      }
    }
    if (payeeMemberId) {
      const payee = group.members.find((m) => String(m._id) === String(payeeMemberId) || String(m.userId) === String(payeeMemberId));
      if (payee) {
        finalPayeeName = payee.name;
      }
    }
  }

  if (!finalPayerName || !finalPayeeName) {
    const error = new Error('Both payer and payee member details are required');
    error.statusCode = 400;
    throw error;
  }

  const settlementExpense = await Expense.create({
    groupId: group._id,
    description: `Settlement: ${finalPayerName.trim()} paid ${finalPayeeName.trim()}`,
    amount: numericAmount,
    paidByMemberId: resolvedPayerMemberId,
    paidBy: finalPayerName.trim(),
    category: 'Settlement',
    date: new Date().toISOString().split('T')[0],
    splits: []
  });

  return settlementExpense;
};

// Get all expenses logged in a group
const getGroupExpenses = async (groupId) => {
  const expenses = await Expense.find({ groupId }).sort({ createdAt: -1 });
  return expenses;
};

module.exports = {
  addExpense,
  recordSettlement,
  getGroupExpenses
};
