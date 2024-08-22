const userRepository = require("../../domain/repositories/userRepository");
const response = require("../../interfaces/utils/templateResponeApi");
const findAllUser = async ({limit,offset, requestId}) => {
  try {
    const getUsers = await userRepository.findAll({limit:limit, offset:(offset-1)*limit, requestId:requestId});
    const result = {
      currentPage: parseInt(offset),
      totalPages: Math.ceil(getUsers.totalUser/limit),
      totalPerPage: limit,
      totalContent: parseInt(getUsers.totalUser),
      content: getUsers.users,
    };
    return response.success(requestId, result, "Success Retrieve Data Users");
  } catch (e) {
    console.error(`Request ID: ${requestId} - User Service error:`, e.message);
    return response.internalServerError(requestId);
  }
};

const createUser = async ({name, requestId}) =>{
  try {
    const defaultQuota =2
    const params = {
      name:name, quota: defaultQuota
    }
    const create = await userRepository.insert({params, requestId:requestId});
    return response.created(requestId, create, "Success Create Data Users");

  } catch (e) {
    console.error(`Request ID: ${requestId} - User Service error:`, e.message);
    return response.internalServerError(requestId)
  }
}
module.exports = {
  findAllUser,createUser
};
