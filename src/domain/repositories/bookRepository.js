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
        console.error(`Request ID: ${requestId} - FindAll Book Repository error:`, error.message);
        throw new Error("Database query error: " + error.message);
    }
}

const insert = async ({params, requestId}) => {
  try {
      return await Book.create(params);
  } catch (error) {
      console.error(`Request ID: ${requestId} - Insert Book Repository error:`, error.message);
      throw new Error("Database query error: " + error.message);
  }
}

const findOneBook = async ({code, requestId, transaction=null})=>{
    try {
        const options = {
            where: { code:code },
        };
        if (transaction) {
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE
        }
        return await Book.findOne(options)
    } catch (error) {
        console.error(`Request ID: ${requestId} - FindOne Book Repository error:`, error.message);
        throw new Error("Database query error: " + error.message);
    }
}

const update = async ({params, code, requestId, transaction=null})=>{
    try {
        const options ={where:{code:code}}
        if (transaction){
            options.transaction = transaction;
            options.lock = transaction.LOCK.UPDATE
        }
        const update = await Book.update(params, options)
        return update
    } catch (error) {
        console.error(`Request ID: ${requestId} - Update Book Repository error:`, error.message);
        throw new Error("Database query error: " + error.message);
    }
}
module.exports = {
    findAllBook, insert, findOneBook,update
}