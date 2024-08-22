const borrowService = require('../../application/services/borrowService')
const {toTemplateResponseApi} = require("../utils/templateResponeApi");

const createBorrows = async (req,res) => {
    const requestId = req.requestId

    const create = await borrowService.createBorrows({codeUser:req.body.codeUser, codeBook:req.body.codeBook, requestId})
    return res.status(create.code).json(toTemplateResponseApi(create));
}
const returnBorrows = async (req,res) => {
    const requestId = req.requestId
    const params = {
        borrowId: req.body.borrow_id ,
        codeUser:req.body.code_user,
        codeBook: req.body.code_book,
        requestId: requestId
    }
    if (!params.borrowId ) {
        if (!params.codeUser || !params.codeBook){
            return res.status(400).json({request_id: requestId,
                status: "Error",
                message: "Either Borrow ID or both Code Book and Code User are required",
                data: null});
            }
        }

    const create = await borrowService.returnBorrows(params)
    return res.status(create.code).json(toTemplateResponseApi(create));
}
module.exports={
    createBorrows,returnBorrows
}