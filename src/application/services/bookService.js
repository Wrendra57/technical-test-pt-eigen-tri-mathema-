const bookRepository = require('../../domain/repositories/bookRepository')
const response = require('../../interfaces/utils/templateResponeApi')
const findAllBooks = async ({limit, offset, requestId}) =>{
    try {
        const getBooks = await bookRepository.findAllBook({limit:limit, offset:(offset-1)*limit, requestId:requestId})
        const result = {
            currentPage: parseInt(offset),
            totalPages: Math.ceil(getBooks.totalBook/limit),
            totalPerPage: limit,
            totalContent: parseInt(getBooks.totalBook),
            content: getBooks.books,
        };
        return response.success(requestId, result, "Success Retrieve Data Books")
    } catch (e) {
        console.error(`Request ID: ${requestId} - Book Service error:`, e.message);
        return  response.internalServerError(requestId)
    }
}

const createBooks = async ({code, title, author, stock, requestId}) => {
    try {
        const getBook = await bookRepository.findOneBook({code:code, requestId:requestId});
        if (getBook !== null) {
            console.error(`Request ID: ${requestId} - Create Books Service Validation error || Code already exists`);
            return  response.badRequest(requestId, "Code already exists")
        }
        const params = {
            code:code,
            author:author,
            stock:stock,
            title:title,
        }
        const book = await bookRepository.insert({params, requestId})
        return response.created(requestId, book, "Success Create Books")

    } catch (e) {
        console.error(`Request ID: ${requestId} - Book Service error:`, e.message);
        return response.internalServerError(requestId)

    }
}

module.exports ={findAllBooks,createBooks}