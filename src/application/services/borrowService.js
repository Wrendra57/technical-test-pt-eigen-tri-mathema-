const userRepository = require('../../domain/repositories/userRepository')
const bookRepository = require('../../domain/repositories/bookRepository')
const borrowRepository = require('../../domain/repositories/borrowRepository')
const sequelize = require('../../infrastructure/database/models').sequelize
const date = require('../../interfaces/utils/date')
const createBorrows= async ({codeUser,codeBook, requestId})=>{
    const transaction = await sequelize.transaction()
    try {
        // check user & quota
        const [getUser, getBooks]= await Promise.all([
            userRepository.findOneUser({code:codeUser, requestId:requestId, transaction:transaction}),
            bookRepository.findOneBook(  {code:codeBook, requestId:requestId, transaction:transaction})
        ])

        if (getUser === null) {
            transaction.rollback()
            console.error(`Request ID: ${requestId} - Create Borrow Service Get user || User not found`);
            return {
                request_id: requestId,
                code:404,
                status: "Error",
                message: "User not found",
                data: null
            }
        }
        if (getUser.quota <= 0 ){
            transaction.rollback()
            console.error(`Request ID: ${requestId} - Create Borrow Service Get user || Quota user 0`);
            return {
                request_id: requestId,
                code:400,
                status: "Error",
                message: "Quota user 0",
                data: null
            }
        }
        if (getUser.penalty_date !== null) {
            if (getUser.penalty_date > new Date()){
                await transaction.rollback()
                console.error(`Request ID: ${requestId} - Create Borrow Service Get user || User has penalty`);
                return {
                    request_id: requestId,
                    code: 400,
                    status: "Error",
                    message: `User has penalty after ${getUser.penalty_date.toUTCString()}`,
                    data: null
                }
            } else {
                await userRepository.update({params:{penalty_date:null}, code:codeUser, requestId, transaction})
            }
        }

        // check book & stock
        if (getBooks === null) {
            transaction.rollback()
            console.error(`Request ID: ${requestId} - Create Borrow Service Get book || Book not found`);
            return {
                request_id: requestId,
                code:404,
                status: "Error",
                message: "Book not found",
                data: null
            }
        }
        if (getBooks.stock <= 0 ) {
            transaction.rollback()
            console.error(`Request ID: ${requestId} - Create Borrow Service Get book || Book stock is 0`);
            return {
                request_id: requestId,
                code:404,
                status: "Error",
                message: "Book stock is 0",
                data: null
            }
        }

        // update create borrow & update user, book of stock
        const {now,dueDate}= await date.dueDateGenerator(3)
        const borrowInsertParams = {
            book_id:codeBook,
            user_id:codeUser,
            checkout_at: now,
            due_date: dueDate,
        }
       await Promise.all([
            borrowRepository.insert({params:borrowInsertParams, requestId,transaction}),
            userRepository.update({params:{quota:getUser.quota - 1}, code:codeUser, requestId, transaction}),
            bookRepository.update({params:{stock:getBooks.stock - 1}, code:codeBook, requestId,transaction})
        ])
        transaction.commit()
        const data = {
            book:{
                code:getBooks.code,
                title:getBooks.title,
                author:getBooks.author,
                stock:getBooks.stock - 1,
            },
            user_id:{
                code:getUser.code,
                name:getUser.name,
                quota:getUser.quota - 1,
                penalty_date:getUser.penalty_date,
            },
            checkout_date: now,
            due_date: dueDate,
        }
        return {
            request_id: requestId,
            code:200,
            status: "Success",
            message: "Success Create Borrow",
            data: data
        }
    } catch (e){
        await transaction.rollback()
        console.error(`Request ID: ${requestId} - Borrow Create Service error:`, e.message);
        return {
            request_id: requestId,
            code:500,
            status: "Error",
            message: "Internal Server Error",
            data: null,
        };
    }
}

module.exports={createBorrows}