const {insert,findOne,update} = require('../borrowRepository')
const {
    sequelize,
    Sequelize,
} = require("../../../infrastructure/database/models");
const models = require('../../../infrastructure/database/models');
const {Error} = require("sequelize");
const Borrow = models.Borrow

jest.mock('../../../infrastructure/database/models', () => {
    const actualSequelize = jest.requireActual('sequelize');
    const SequelizeMock = jest.fn(() => ({
        query: jest.fn(),
    }));
    SequelizeMock.Sequelize = actualSequelize.Sequelize;

    return {
        sequelize: new SequelizeMock(),
        Sequelize: actualSequelize.Sequelize,
        Borrow: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
        },
    };
});

describe('insert || Borrow Repository unit test insert()',()=>{
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
    }
    const transaction = {
        LOCK : {
            UPDATE : 'UPDATE'
        }
    }
    const requestId="Test-id"
    it('should success create borrow and return data borrow without transaction', async () => {
        Borrow.create.mockResolvedValue(mockBorrow)

        const params = {
            book_id: mockBorrow.book_id,
            user_id: mockBorrow.user_id,
            checkout_at: mockBorrow.checkout_at,
            due_date: mockBorrow.due_date
        }
        const result = await insert({ params, requestId: requestId });

        expect(result).toEqual(mockBorrow);
        expect(Borrow.create).toHaveBeenCalledWith(params,{});
    });

    it('should success create borrow and return data borrow with transaction', async () => {
        Borrow.create.mockResolvedValue(mockBorrow)

        const params = {
            book_id: mockBorrow.book_id,
            user_id: mockBorrow.user_id,
            checkout_at: mockBorrow.checkout_at,
            due_date: mockBorrow.due_date
        }
        const result = await insert({ params, requestId: requestId, transaction:transaction });

        expect(result).toEqual(mockBorrow);
        expect(Borrow.create).toHaveBeenCalledWith(params,{"transaction": transaction, "lock": transaction.LOCK.UPDATE});
    });

    it('should failed create borrow and return error without transaction', async () => {
        Borrow.create.mockRejectedValue(new Error(`Database error`));

        const params = {
            book_id: mockBorrow.book_id,
            user_id: mockBorrow.user_id,
            checkout_at: mockBorrow.checkout_at,
            due_date: mockBorrow.due_date
        }
        await expect(insert({ params, requestId: requestId })).rejects.toThrow(
            'Database query error: Database error'
        );
        expect(Borrow.create).toHaveBeenCalledWith(params,{});
    });

    it('should failed create borrow and return error with transaction', async () => {
        Borrow.create.mockRejectedValue(new Error(`Database error`));

        const params = {
            book_id: mockBorrow.book_id,
            user_id: mockBorrow.user_id,
            checkout_at: mockBorrow.checkout_at,
            due_date: mockBorrow.due_date
        }
        await expect(insert({ params, requestId: requestId, transaction:transaction })).rejects.toThrow(
            'Database query error: Database error'
        );
        expect(Borrow.create).toHaveBeenCalledWith(params,{"transaction": transaction, "lock": transaction.LOCK.UPDATE});
    });
})

describe('findOne || Borrow Repository unit test findOne()', () => {
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
    const transaction = {
        LOCK: {
            UPDATE: 'UPDATE'
        }
    };
    const requestId = "Test-id";

    it('should successfully find a borrow record without transaction', async () => {
        Borrow.findOne.mockResolvedValue(mockBorrow);

        const params = { id: mockBorrow.id };
        const result = await findOne({ params, requestId });

        expect(result).toEqual(mockBorrow);
        expect(Borrow.findOne).toHaveBeenCalledWith({ where: params });
    });

    it('should successfully find a borrow record with transaction', async () => {
        Borrow.findOne.mockResolvedValue(mockBorrow);

        const params = { id: mockBorrow.id };
        const result = await findOne({ params, requestId, transaction });

        expect(result).toEqual(mockBorrow);
        expect(Borrow.findOne).toHaveBeenCalledWith({ where: params, transaction, lock: transaction.LOCK.UPDATE });
    });

    it('should fail to find a borrow record without transaction', async () => {
        Borrow.findOne.mockRejectedValue(new Error('Database error'));

        const params = { id: mockBorrow.id };
        await expect(findOne({ params, requestId })).rejects.toThrow('Database query error: Database error');
        expect(Borrow.findOne).toHaveBeenCalledWith({ where: params });
    });

    it('should fail to find a borrow record with transaction', async () => {
        Borrow.findOne.mockRejectedValue(new Error('Database error'));

        const params = { id: mockBorrow.id };
        await expect(findOne({ params, requestId, transaction })).rejects.toThrow('Database query error: Database error');
        expect(Borrow.findOne).toHaveBeenCalledWith({ where: params, transaction, lock: transaction.LOCK.UPDATE });
    });
});

describe('update || Borrow Repository unit test update()', () => {
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
    const transaction = {
        LOCK: {
            UPDATE: 'UPDATE'
        }
    };
    const requestId = "Test-id";

    it('should successfully update a borrow record without transaction', async () => {
        Borrow.update.mockResolvedValue([1]);

        const params = { return_date: new Date() };
        const result = await update({ params, id: mockBorrow.id, requestId });

        expect(result).toEqual([1]);
        expect(Borrow.update).toHaveBeenCalledWith(params, { where: { id: mockBorrow.id } });
    });

    it('should successfully update a borrow record with transaction', async () => {
        Borrow.update.mockResolvedValue([1]);

        const params = { return_date: new Date() };
        const result = await update({ params, id: mockBorrow.id, requestId, transaction });

        expect(result).toEqual([1]);
        expect(Borrow.update).toHaveBeenCalledWith(params, { where: { id: mockBorrow.id }, transaction, lock: transaction.LOCK.UPDATE });
    });

    it('should fail to update a borrow record without transaction', async () => {
        Borrow.update.mockRejectedValue(new Error('Database error'));

        const params = { return_date: new Date() };
        await expect(update({ params, id: mockBorrow.id, requestId })).rejects.toThrow('Database query error: Database error');
        expect(Borrow.update).toHaveBeenCalledWith(params, { where: { id: mockBorrow.id } });
    });

    it('should fail to update a borrow record with transaction', async () => {
        Borrow.update.mockRejectedValue(new Error('Database error'));

        const params = { return_date: new Date() };
        await expect(update({ params, id: mockBorrow.id, requestId, transaction })).rejects.toThrow('Database query error: Database error');
        expect(Borrow.update).toHaveBeenCalledWith(params, { where: { id: mockBorrow.id }, transaction, lock: transaction.LOCK.UPDATE });
    });
});