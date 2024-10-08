const bookService = require('../../application/services/bookService')
const {toTemplateResponseApi} = require('../utils/templateResponeApi')

const getListBooks = async (req, res) => {
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
    const books = await bookService.findAllBooks({limit:limit,offset:offset,requestId:requestId})

    return res.status(books.code).json(toTemplateResponseApi(books))
}

const createBook = async (req,res) =>{
    const requestId = req.requestId

    const book = await bookService.createBooks({
        code:req.body.code,
        title:req.body.title,
        author:req.body.author,
        stock:req.body.stock,
        requestId:requestId
    })

    return res.status(book.code).json(toTemplateResponseApi(book))
}
module.exports={
    getListBooks,createBook
}