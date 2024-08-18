const userRepository = require("../../domain/repositories/userRepository");

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
    return {
      request_id: requestId,
      code:200,
      status: "Success",
      message: "Success Retrieve Data Users",
      data: result
    };
  } catch (e) {
    console.error(`Request ID: ${requestId} - User Service error:`, e.message);
    return {
      request_id: requestId,
      code:500,
      status: "Error",
      message: "Internal Server Error",
      data: null,
    };
  }
};

module.exports = {
  findAllUser,
};
