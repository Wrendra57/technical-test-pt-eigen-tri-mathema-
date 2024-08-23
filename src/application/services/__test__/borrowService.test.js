const borrowRepository = require('../../../domain/repositories/borrowRepository');
const userRepository = require('../../../domain/repositories/userRepository');
const bookRepository = require('../../../domain/repositories/bookRepository');
const { createBorrows } = require('../borrowService');
const sequelize = require('../../../infrastructure/database/models').sequelize;
const date = require('../../../interfaces/utils/date');

jest.mock("../../../domain/repositories/borrowRepository");
jest.mock("../../../domain/repositories/userRepository");
jest.mock("../../../domain/repositories/bookRepository");
jest.mock("../../../infrastructure/database/models", ()=>{
    const actualSequelize = jest.requireActual('sequelize');
    const SequelizeMock = jest.fn(() => ({
        transaction: jest.fn(),
    }));
    SequelizeMock.Sequelize = actualSequelize.Sequelize;

    return {
        sequelize: new SequelizeMock(),
    };
})
jest.mock("../../../interfaces/utils/date");


describe("Create Borrow Service", () => {
    let mockTransaction;

    beforeEach(() => {
        mockTransaction = {
            commit: jest.fn(),
            rollback: jest.fn(),
        };

        sequelize.transaction.mockResolvedValue(mockTransaction);
    });
    afterEach(() => {
        jest.clearAllMocks();
    })
    const mockBorrow = {
        id: 1,
        book_id: "MH-1",
        user_id: "M001",
        checkout_at: new Date(),
        due_date: new Date(),
        return_date: null,
        created_at: "2024-08-19T12:07:32.081Z",
        updated_at: "2024-08-19T12:07:32.081Z",
        deleted_at: null
    }
    const mockUser = {
        code: "M013",
        name: "test name",
        quota: 2,
        updated_at: "2024-08-19T12:07:32.081Z",
        created_at: "2024-08-19T12:07:32.081Z",
        id: 1,
        penalty_date: null,
        deleted_at: null,
    }
    const mockBooks= {
        id: 1,
        code: "JK-01",
        title: "Books Testing",
        author: "Books author testing",
        stock: 1,
        created_at: "2024-08-18T12:40:08.128Z",
        updated_at: "2024-08-18T12:40:08.128Z",
        deleted_at: null
    }
    const requestId="Test-id"
    it('should return borrow data on success', async () => {
        userRepository.findOneUser.mockResolvedValue(mockUser)
        bookRepository.findOneBook.mockResolvedValue(mockBooks)
        borrowRepository.insert.mockResolvedValue(mockBorrow)
        userRepository.update.mockResolvedValue([1])
        bookRepository.update.mockResolvedValue([1])
        date.dueDateGenerator.mockResolvedValue({now:mockBorrow.checkout_at, dueDate:mockBorrow.due_date})
        const result = await createBorrows({ codeUser:mockUser.code, codeBook:mockBooks.code, requestId: requestId })

        const data = {
            id: 1,
            book:{
                code:mockBooks.code,
                title:mockBooks.title,
                author:mockBooks.author,
                stock:mockBooks.stock - 1,
            },
            user_id:{
                code:mockUser.code,
                name:mockUser.name,
                quota:mockUser.quota - 1,
                penalty_date:mockUser.penalty_date,
            },
            checkout_date: mockBorrow.checkout_at,
            due_date: mockBorrow.due_date,
        }
        expect(result).toEqual({
            request_id: requestId,
            code: 201,
            status: "Success",
            message: "Success Create Borrow",
            data:data,
        })

        expect(sequelize.transaction).toHaveBeenCalled()
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(borrowRepository.insert).toHaveBeenCalledWith({ params: { book_id: mockBooks.code, user_id: mockUser.code, checkout_at: mockBorrow.checkout_at, due_date: mockBorrow.due_date }, requestId, transaction:mockTransaction })
        expect(userRepository.update).toHaveBeenCalledWith({ params: { quota: mockUser.quota - 1 }, code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.update).toHaveBeenCalledWith({ params: { stock: mockBooks.stock - 1 }, code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(mockTransaction.commit).toHaveBeenCalled()
    });

    it('should return borrow data on success with penalty is done', async () => {
        const dueDate = new Date();
        dueDate.setDate(new Date().getDate() - 3);
        const user = mockUser
        user.penalty_date=dueDate
        userRepository.findOneUser.mockResolvedValue(user)
        bookRepository.findOneBook.mockResolvedValue(mockBooks)
        borrowRepository.insert.mockResolvedValue(mockBorrow)
        userRepository.update.mockResolvedValue([1])
        bookRepository.update.mockResolvedValue([1])
        date.dueDateGenerator.mockResolvedValue({now:mockBorrow.checkout_at, dueDate:mockBorrow.due_date})
        const result = await createBorrows({ codeUser:mockUser.code, codeBook:mockBooks.code, requestId: requestId })

        const data = {
            id:mockBorrow.id,
            book:{
                code:mockBooks.code,
                title:mockBooks.title,
                author:mockBooks.author,
                stock:mockBooks.stock - 1,
            },
            user_id:{
                code:mockUser.code,
                name:mockUser.name,
                quota:mockUser.quota - 1,
                penalty_date:mockUser.penalty_date,
            },
            checkout_date: mockBorrow.checkout_at,
            due_date: mockBorrow.due_date,
        }
        expect(result).toEqual({
            request_id: requestId,
            code: 201,
            status: "Success",
            message: "Success Create Borrow",
            data:data,
        })

        expect(sequelize.transaction).toHaveBeenCalled()
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(borrowRepository.insert).toHaveBeenCalledWith({ params: { book_id: mockBooks.code, user_id: mockUser.code, checkout_at: mockBorrow.checkout_at, due_date: mockBorrow.due_date }, requestId, transaction:mockTransaction })
        expect(userRepository.update).toHaveBeenCalledWith({ params: { quota: mockUser.quota - 1 }, code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.update).toHaveBeenCalledWith({ params: { stock: mockBooks.stock - 1 }, code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(mockTransaction.commit).toHaveBeenCalled()
    });

    it('should return error user not found', async () => {
        userRepository.findOneUser.mockResolvedValue(null)
        bookRepository.findOneBook.mockResolvedValue(mockBooks)

        const result = await createBorrows({ codeUser:mockUser.code, codeBook:mockBooks.code, requestId: requestId })

        expect(result).toEqual({
            request_id: requestId,
            code: 404,
            status: "Error",
            message: "User not found",
            data:null,
        })

        expect(sequelize.transaction).toHaveBeenCalled()
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(mockTransaction.rollback).toHaveBeenCalled()
    });
    it('should return error quota user 0', async () => {
        const user = {
            code: "M013",
            name: "test name",
            quota: 0,
            updated_at: "2024-08-19T12:07:32.081Z",
            created_at: "2024-08-19T12:07:32.081Z",
            id: 1,
            penalty_date: null,
            deleted_at: null,
        }
        userRepository.findOneUser.mockResolvedValue(user)
        bookRepository.findOneBook.mockResolvedValue(mockBooks)

        const result = await createBorrows({ codeUser:mockUser.code, codeBook:mockBooks.code, requestId: requestId })

        expect(result).toEqual({
            request_id: requestId,
            code: 400,
            status: "Error",
            message: "Quota user 0",
            data:null,
        })

        expect(sequelize.transaction).toHaveBeenCalled()
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(mockTransaction.rollback).toHaveBeenCalled()
    });

    it('should return error user have penalty', async () => {
        const dueDate = new Date();
        dueDate.setDate(new Date().getDate() + 3);
        const user = {
            code: "M013",
            name: "test name",
            quota: 2,
            updated_at: "2024-08-19T12:07:32.081Z",
            created_at: "2024-08-19T12:07:32.081Z",
            id: 1,
            penalty_date: dueDate,
            deleted_at: null,
        }
        userRepository.findOneUser.mockResolvedValue(user)
        bookRepository.findOneBook.mockResolvedValue(mockBooks)

        const result = await createBorrows({ codeUser:mockUser.code, codeBook:mockBooks.code, requestId: requestId })

        expect(result).toEqual({
            request_id: requestId,
            code: 400,
            status: "Error",
            message: `User has penalty after ${dueDate.toUTCString()}`,
            data:null,
        })

        expect(sequelize.transaction).toHaveBeenCalled()
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(mockTransaction.rollback).toHaveBeenCalled()
    });

    it('should return error book not found', async () => {

        userRepository.findOneUser.mockResolvedValue(mockUser)
        bookRepository.findOneBook.mockResolvedValue(null)

        const result = await createBorrows({ codeUser:mockUser.code, codeBook:mockBooks.code, requestId: requestId })

        expect(result).toEqual({
            request_id: requestId,
            code: 404,
            status: "Error",
            message: `Book not found`,
            data:null,
        })

        expect(sequelize.transaction).toHaveBeenCalled()
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(mockTransaction.rollback).toHaveBeenCalled()
    });

    it('should return error book out of stock', async () => {
        const book= {
            id: 1,
            code: "JK-01",
            title: "Books Testing",
            author: "Books author testing",
            stock: 0,
            created_at: "2024-08-18T12:40:08.128Z",
            updated_at: "2024-08-18T12:40:08.128Z",
            deleted_at: null
        }
        userRepository.findOneUser.mockResolvedValue(mockUser)
        bookRepository.findOneBook.mockResolvedValue(book)

        const result = await createBorrows({ codeUser:mockUser.code, codeBook:mockBooks.code, requestId: requestId })

        expect(result).toEqual({
            request_id: requestId,
            code: 404,
            status: "Error",
            message: `Book stock is 0`,
            data:null,
        })

        expect(sequelize.transaction).toHaveBeenCalled()
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(mockTransaction.rollback).toHaveBeenCalled()
    });

    it('should return error internal server error findOneUser error', async () => {

        userRepository.findOneUser.mockRejectedValue(new Error("Database error"))
        bookRepository.findOneBook.mockResolvedValue(mockBooks)

        const result = await createBorrows({ codeUser:mockUser.code, codeBook:mockBooks.code, requestId: requestId })

        expect(result).toEqual({
            request_id: requestId,
            code: 500,
            status: "Error",
            message: `Internal Server Error`,
            data:null,
        })

        expect(sequelize.transaction).toHaveBeenCalled()
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(mockTransaction.rollback).toHaveBeenCalled()
    });

    it('should return error internal server error findOneBook error', async () => {

        userRepository.findOneUser.mockRejectedValue(mockUser)
        bookRepository.findOneBook.mockRejectedValue(new Error("Database error"))

        const result = await createBorrows({ codeUser:mockUser.code, codeBook:mockBooks.code, requestId: requestId })

        expect(result).toEqual({
            request_id: requestId,
            code: 500,
            status: "Error",
            message: `Internal Server Error`,
            data:null,
        })

        expect(sequelize.transaction).toHaveBeenCalled()
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction:mockTransaction })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBooks.code, requestId, transaction:mockTransaction })
        expect(mockTransaction.rollback).toHaveBeenCalled()
    });

})