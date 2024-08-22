const borrowService = require('../../application/services/borrowService')
const {toTemplateResponseApi} = require("../utils/templateResponeApi");

const createBorrows = async (req,res) => {
    const requestId = req.requestId

    const create = await borrowService.createBorrows({codeUser:req.body.codeUser, codeBook:req.body.codeBook, requestId})
    return res.status(create.code).json(toTemplateResponseApi(create));
}

module.exports={
    createBorrows
}