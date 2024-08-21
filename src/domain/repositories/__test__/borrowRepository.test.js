const {insert} = require('../borrowRepository')
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