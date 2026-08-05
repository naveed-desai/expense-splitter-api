const { groupService } = require('../services');
const logger = require('../utils/logger');

const createGroup = async (req, res, next) => {
  try {
    logger.info('API request received: POST /groups');
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      logger.warn('Failed request: Group name is required');
      return res.status(400).json({
        success: false,
        message: 'Group name is required'
      });
    }

    const createdGroup = await groupService.createGroup({ name, description });

    logger.info(`Successful response: Group created successfully`);
    return res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: createdGroup
    });
  } catch (error) {
    logger.error(`Error in createGroup: ${error.message}`);
    next(error);
  }
};

const getGroups = async (req, res, next) => {
  try {
    logger.info('API request received: GET /groups');
    const groupsList = await groupService.getGroups();

    logger.info('Successful response: Groups retrieved successfully');
    return res.status(200).json({
      success: true,
      data: groupsList
    });
  } catch (error) {
    logger.error(`Error in getGroups: ${error.message}`);
    next(error);
  }
};

const getGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`API request received: GET /groups/${id}`);

    const groupItem = await groupService.getGroupById(id);

    if (!groupItem) {
      logger.warn(`Failed request: Group not found with ID ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    logger.info(`Successful response: Group retrieved successfully for ID ${id}`);
    return res.status(200).json({
      success: true,
      data: groupItem
    });
  } catch (error) {
    logger.error(`Error in getGroupById: ${error.message}`);
    next(error);
  }
};

const addMemberToGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { userId, name } = req.body;
    logger.info(`API request received: POST /groups/${groupId}/members`);

    const newMember = await groupService.addMemberToGroup({ groupId, userId, name });

    logger.info(`Successful response: Member added to group ${groupId}`);
    return res.status(201).json({
      success: true,
      message: 'Member added to group successfully',
      data: newMember
    });
  } catch (error) {
    logger.error(`Error in addMemberToGroup: ${error.message}`);
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
    logger.info(`API request received: GET /groups/${groupId}/available-users`);

    const availableUsers = await groupService.getAvailableUsers(groupId);

    logger.info(`Successful response: Available users retrieved for group ${groupId}`);
    return res.status(200).json({
      success: true,
      data: availableUsers
    });
  } catch (error) {
    logger.error(`Error in getAvailableUsers: ${error.message}`);
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    logger.info('API request received: GET /users');
    const users = await groupService.getAllUsers();
    logger.info('Successful response: Users retrieved successfully');
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error(`Error in getAllUsers: ${error.message}`);
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
