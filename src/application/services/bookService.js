const bookRepository = require('../../domain/repositories/bookRepository')

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

        return {
            request_id: requestId,
            code:200,
            status: "Success",
            message: "Success Retrieve Data Books",
            data: result
        };
    } catch (e) {
        console.error(`Request ID: ${requestId} - Book Service error:`, e.message);
        return {
            request_id: requestId,
            code:500,
            status: "Error",
            message: "Internal Server Error",
            data: null,
        };
    }
}

const createBooks = async ({code, title, author, stock, requestId}) => {
    try {
        const getBook = await bookRepository.findOneBook({code:code, requestId:requestId});
        if (getBook !== null) {
            console.error(`Request ID: ${requestId} - Create Books Service Validation error || Code already exists`);
            return {
                request_id: requestId,
                code:400,
                status: "Error",
                message: "Code already exists",
                data: null
            }
        }
        const params = {
            code:code,
            author:author,
            stock:stock,
            title:title,
        }
        const book = await bookRepository.insert({params, requestId})
        return {
            request_id: requestId,
            code:200,
            status: "Success",
            message: "Success Create Books",
            data: book
        };
    } catch (e) {
        console.error(`Request ID: ${requestId} - Book Service error:`, e.message);
        return {
            request_id: requestId,
            code:500,
            status: "Error",
            message: "Internal Server Error",
            data: null,
        };
    }
}

module.exports ={findAllBooks,createBooks}