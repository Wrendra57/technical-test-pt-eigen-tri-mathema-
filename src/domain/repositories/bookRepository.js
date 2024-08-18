const models = require('../../infrastructure/database/models/index.js');
const Book = models.Book

const findAllBook = async ({limit, offset, requestId})=>{
    try {
        let books
        books = await Book.findAll({limit:limit, offset:offset, order:['title'], where: {
                deleted_at: null
            } })
        const totalBook = await Book.count({where:{deleted_at:null}})
        return {books: books, totalBook: totalBook}
    } catch (error) {
        console.error(`Request ID: ${requestId} - Book Repository error:`, error.message);
        throw new Error("Database query error: " + error.message);
    }
}

module.exports = {
    findAllBook,
}