const borrowRepository = require('../../../domain/repositories/borrowRepository');
const userRepository = require('../../../domain/repositories/userRepository');
const bookRepository = require('../../../domain/repositories/bookRepository');
const { createBorrows,returnBorrows } = require('../borrowService');
const sequelize = require('../../../infrastructure/database/models').sequelize;
const date = require('../../../interfaces/utils/date');
const response = require('../../../interfaces/utils/templateResponeApi');

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
jest.mock('../../../interfaces/utils/templateResponeApi');
jest.mock("../../../interfaces/utils/date");


describe('createBorrows || Borrow Service unit test createBorrows()', () => {
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
    });

    const mockUser = {
        code: "M001",
        name: "User Test",
        quota: 1,
        penalty_date: null,
    };
    const mockBook = {
        code: "MH-1",
        title: "Book Test",
        author: "Author Test",
        stock: 1,
    };
    const requestId = "Test-id";

    it('should successfully create a borrow record', async () => {
        userRepository.findOneUser.mockResolvedValue(mockUser);
        bookRepository.findOneBook.mockResolvedValue(mockBook);
        date.dueDateGenerator.mockResolvedValue({ now: new Date(), dueDate: new Date() });
        borrowRepository.insert.mockResolvedValue({ id: 1 });
        userRepository.update.mockResolvedValue({});
        bookRepository.update.mockResolvedValue({});

        const result = await createBorrows({ codeUser: mockUser.code, codeBook: mockBook.code, requestId });

        expect(result).toEqual(response.created(requestId, expect.any(Object), "Success Create Borrow"));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction: mockTransaction });
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBook.code, requestId, transaction: mockTransaction });
        expect(borrowRepository.insert).toHaveBeenCalled();
        expect(userRepository.update).toHaveBeenCalled();
        expect(bookRepository.update).toHaveBeenCalled();
        expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should fail to create a borrow record when user not found', async () => {
        userRepository.findOneUser.mockResolvedValue(null);

        const result = await createBorrows({ codeUser: mockUser.code, codeBook: mockBook.code, requestId });

        expect(result).toEqual(response.notFound(requestId, "User not found"));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should fail to create a borrow record when user quota is 0', async () => {
        const userWithNoQuota = { ...mockUser, quota: 0 };
        userRepository.findOneUser.mockResolvedValue(userWithNoQuota);

        const result = await createBorrows({ codeUser: mockUser.code, codeBook: mockBook.code, requestId });

        expect(result).toEqual(response.badRequest(requestId, "Quota user 0"));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should fail to create a borrow record when user has penalty', async () => {
        const userWithPenalty = { ...mockUser, penalty_date: new Date(Date.now() + 86400000) }; // penalty date is tomorrow
        userRepository.findOneUser.mockResolvedValue(userWithPenalty);

        const result = await createBorrows({ codeUser: mockUser.code, codeBook: mockBook.code, requestId });

        expect(result).toEqual(response.badRequest(requestId, `User has penalty after ${userWithPenalty.penalty_date.toUTCString()}`));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should fail to create a borrow record when book not found', async () => {
        userRepository.findOneUser.mockResolvedValue(mockUser);
        bookRepository.findOneBook.mockResolvedValue(null);

        const result = await createBorrows({ codeUser: mockUser.code, codeBook: mockBook.code, requestId });

        expect(result).toEqual(response.notFound(requestId, "Book not found"));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction: mockTransaction });
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBook.code, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should fail to create a borrow record when book stock is 0', async () => {
        const bookWithNoStock = { ...mockBook, stock: 0 };
        userRepository.findOneUser.mockResolvedValue(mockUser);
        bookRepository.findOneBook.mockResolvedValue(bookWithNoStock);

        const result = await createBorrows({ codeUser: mockUser.code, codeBook: mockBook.code, requestId });

        expect(result).toEqual(response.notFound(requestId, "Book stock is 0"));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction: mockTransaction });
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBook.code, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should fail to create a borrow record due to internal server error', async () => {
        userRepository.findOneUser.mockRejectedValue(new Error("Database error"));

        const result = await createBorrows({ codeUser: mockUser.code, codeBook: mockBook.code, requestId });

        expect(result).toEqual(response.internalServerError(requestId));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockUser.code, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });
});
describe('returnBorrows || Borrow Service unit test returnBorrows()', () => {
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
    });

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
    };
    const mockUser = {
        code: "M001",
        name: "User Test",
        quota: 1,
        penalty_date: null,
    };
    const mockBook = {
        code: "MH-1",
        title: "Book Test",
        author: "Author Test",
        stock: 1,
    };
    const requestId = "Test-id";

    it('should successfully return a borrow record', async () => {
        borrowRepository.findOne.mockResolvedValue(mockBorrow);
        userRepository.findOneUser.mockResolvedValue(mockUser);
        bookRepository.findOneBook.mockResolvedValue(mockBook);
        date.dueDateGenerator.mockResolvedValue({ now: new Date(), dueDate: new Date() });

        const result = await returnBorrows({ borrowId: mockBorrow.id, codeUser: null, codeBook: null, requestId });

        expect(result).toEqual(response.success(requestId, { getBorrow: mockBorrow }, "Success Return Borrow"));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(borrowRepository.findOne).toHaveBeenCalledWith({ params: { id: mockBorrow.id }, requestId, transaction: mockTransaction });
        expect(userRepository.findOneUser).toHaveBeenCalledWith({ code: mockBorrow.user_id, requestId, transaction: mockTransaction });
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({ code: mockBorrow.book_id, requestId, transaction: mockTransaction });
        expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should fail to return a borrow record when borrow not found', async () => {
        borrowRepository.findOne.mockResolvedValue(null);

        const result = await returnBorrows({ borrowId: mockBorrow.id, codeUser: null, codeBook: null, requestId });

        expect(result).toEqual(response.notFound(requestId, "Borrow not found"));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(borrowRepository.findOne).toHaveBeenCalledWith({ params: { id: mockBorrow.id }, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should fail to return a borrow record when book has already been returned', async () => {
        const returnedBorrow = { ...mockBorrow, return_date: new Date() };
        borrowRepository.findOne.mockResolvedValue(returnedBorrow);

        const result = await returnBorrows({ borrowId: mockBorrow.id, codeUser: null, codeBook: null, requestId });

        expect(result).toEqual(response.badRequest(requestId, "Book has been returned"));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(borrowRepository.findOne).toHaveBeenCalledWith({ params: { id: mockBorrow.id }, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should fail to return a borrow record due to internal server error', async () => {
        borrowRepository.findOne.mockRejectedValue(new Error("Database error"));

        const result = await returnBorrows({ borrowId: mockBorrow.id, codeUser: null, codeBook: null, requestId });

        expect(result).toEqual(response.internalServerError(requestId));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(borrowRepository.findOne).toHaveBeenCalledWith({ params: { id: mockBorrow.id }, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should fail to return a borrow record when codeUser and codeBook are provided but no matching borrow is found', async () => {
        borrowRepository.findOne.mockResolvedValue(null);

        const result = await returnBorrows({ codeUser: mockUser.code, codeBook: mockBook.code, requestId });

        expect(result).toEqual(response.notFound(requestId, "Borrow not found"));
        expect(sequelize.transaction).toHaveBeenCalled();
        expect(borrowRepository.findOne).toHaveBeenCalledWith({ params: { book_id: mockBook.code, user_id: mockUser.code }, requestId, transaction: mockTransaction });
        expect(mockTransaction.rollback).toHaveBeenCalled();
    });
});