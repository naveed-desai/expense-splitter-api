const { groupService } = require('../services');

const createGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    const createdGroup = await groupService.createGroup({ name, description });

    return res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: createdGroup
    });
  } catch (error) {
    next(error);
  }
};

const getGroups = async (req, res, next) => {
  try {
    const groupsList = await groupService.getGroups();

    return res.status(200).json({
      success: true,
      data: groupsList
    });
  } catch (error) {
    next(error);
  }
};

const getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const groupItem = await groupService.getGroupById(id);

    if (!groupItem) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: groupItem
    });
  } catch (error) {
    next(error);
  }
};

const addMemberToGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId, name } = req.body;

    const newMember = await groupService.addMemberToGroup({ groupId, userId, name });

    return res.status(201).json({
      success: true,
      message: 'Member added to group successfully',
      data: newMember
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

const getAvailableUsers = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const availableUsers = await groupService.getAvailableUsers(groupId);

    return res.status(200).json({
      success: true,
      data: availableUsers
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await groupService.getAllUsers();
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  addMemberToGroup,
  getAvailableUsers,
  getAllUsers
};
