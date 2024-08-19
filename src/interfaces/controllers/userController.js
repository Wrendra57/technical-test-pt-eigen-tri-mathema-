const userService = require("../../application/services/userService");
const toTemplateResponseApi = require('../utils/templateResponeApi')
const getListUser = async (req, res) => {
  const requestId = req.requestId
  let limit = req.query.limit
  if (limit === undefined || limit === "") {
    limit = 5
  } else {
    limit = Number(limit)
    if (isNaN(limit) || limit < 1) {
      console.error(`Request ID: ${requestId} - Limit error: Limit Must Be Positive Number`);
      return res.status(400).json({request_id: requestId,
        status: "Error",
        message: "Limit Must Be Positive Number",
        data: null});
    }
  }

  let offset = req.query.page
  if (offset === undefined || offset === "") {
    offset = 1
  } else {
    offset = Number(offset)
    if (isNaN(offset) || offset < 1) {
      console.error(`Request ID: ${requestId} - Offset error: Limit Must Be Positive Number`);
      return res.status(400).json({request_id: requestId,
        status: "Error",
        message: "Offset Must Be Positive Number",
        data: null});
    }
  }
  const users =await userService.findAllUser({limit:limit,offset:offset,requestId:requestId});

  return res.status(users.code).json(toTemplateResponseApi(users));
};

const createUser = async (req,res)=>{
  const requestId = req.requestId

  let name = req.body.name;

  const create = await userService.createUser({name,requestId})

  return res.status(create.code).json(toTemplateResponseApi(create));
}
module.exports = {
  getListUser,createUser
};
