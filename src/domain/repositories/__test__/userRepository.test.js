const {findAll, insert, findOneUser, update} = require('../userRepository')
const {
    sequelize,
} = require("../../../infrastructure/database/models/index.js");
const models = require('../../../infrastructure/database/models/index.js');
const {findOneBook} = require("../bookRepository");
const {Error} = require("sequelize");
const User = models.User

//mock

jest.mock('../../../infrastructure/database/models/index.js', () => {
    const actualSequelize = jest.requireActual('sequelize');
    const SequelizeMock = jest.fn(() => ({
        query: jest.fn(),
    }));
    SequelizeMock.Sequelize = actualSequelize.Sequelize;

    return {
        sequelize: new SequelizeMock(),
        Sequelize: actualSequelize.Sequelize,
        User: {
            count: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn()
        },
    };
});

describe('findAllUserRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    const mockUsers=[
        {
            user_code: '123',
            name: 'John Doe',
            quota: 5,
            penalty_date: null,
            book_borrowed: [],
            created_at: '2023-01-01',
        },
    ]
    const mockTotalUser=10
    it('should return users and total user count', async () => {

        sequelize.query.mockResolvedValue([mockUsers,"sequlize detail" ])
        User.count.mockResolvedValue(mockTotalUser)

        const result = await findAll({ limit: 10, offset: 0, requestId: 'test-id' });

        expect(result.users).toEqual(mockUsers);
        expect(result.totalUser).toBe(mockTotalUser);
        expect(sequelize.query).toHaveBeenCalledWith(expect.any(String));
        expect(User.count).toHaveBeenCalledWith({ where: { deleted_at: null } });
    });
    it('should handle database errors gracefully', async ()=>{
        sequelize.query.mockRejectedValue(new Error(`Database error`));
        User.count.mockResolvedValue(0)

        await expect(findAll({ limit: 10, offset: 0, requestId: 'test-id' })).rejects.toThrow(
            'Database query error: Database error'
        );

        expect(sequelize.query).toHaveBeenCalledWith(expect.any(String));

    })
})

describe('insertUserRepository', ()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    const mockUsers= {
        code: "M013",
        name: "test name",
        quota: 2,
        updated_at: "2024-08-19T12:07:32.081Z",
        created_at: "2024-08-19T12:07:32.081Z",
        id: 1,
        penalty_date: null,
        deleted_at: null,
    }

    it('should success create user and return user data', async () => {
        User.create.mockResolvedValue(mockUsers)

        const params = {
            name: mockUsers.name,
            quota: mockUsers.quota
        }
        const result = await insert({ params, requestId: 'test-id' });

        expect(result).toEqual(mockUsers);
        expect(User.create).toHaveBeenCalledWith(params);
        expect(User.create).toHaveBeenCalledTimes(1)
    });
    it('should failed create user and return error', async () => {
        User.create.mockRejectedValue(new Error(`Database error`));

        const params = {
            name: mockUsers.name,
            quota: mockUsers.quota
        }
        await expect(insert({ params, requestId: 'test-id' })).rejects.toThrow(
            'Database query error: Database error'
        );

        expect(User.create).toHaveBeenCalledWith(params);
    });
})

describe('find One User || User Repository unit test', ()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    const mockUsers= {
        code: "M013",
        name: "test name",
        quota: 2,
        updated_at: "2024-08-19T12:07:32.081Z",
        created_at: "2024-08-19T12:07:32.081Z",
        id: 1,
        penalty_date: null,
        deleted_at: null,
    }
    const transaction = {
        LOCK : {
            UPDATE : 'UPDATE'
        }
    }
    const requestId="Test-id"
    it('should success findOneUser and return a data user without transaction', async () => {
        User.findOne.mockResolvedValue(mockUsers)

        const result = await findOneUser({code:mockUsers.code, requestId:requestId})

        expect(result).toEqual(mockUsers);
        expect(User.findOne).toHaveBeenCalledWith({"where": {"code": mockUsers.code}});
    });

    it('should success findOneUser and return a data user with transaction', async () => {
        User.findOne.mockResolvedValue(mockUsers)

        const result = await findOneUser({code:mockUsers.code, requestId:requestId, transaction:transaction})

        expect(result).toEqual(mockUsers);
        expect(User.findOne).toHaveBeenCalledWith({"where": {"code": mockUsers.code}, "transaction":transaction, "lock":transaction.LOCK.UPDATE});
    });

    it('should null findOneUser and return a null without transaction', async () => {
        User.findOne.mockResolvedValue(null)

        const result = await findOneUser({code:mockUsers.code, requestId:requestId})

        expect(result).toEqual(null);
        expect(User.findOne).toHaveBeenCalledWith({"where": {"code": mockUsers.code}});
    });

    it('should null findOneUser and return null with transaction', async () => {
        User.findOne.mockResolvedValue(null)

        const result = await findOneUser({code:mockUsers.code, requestId:requestId, transaction:transaction})

        expect(result).toEqual(null);
        expect(User.findOne).toHaveBeenCalledWith({"where": {"code": mockUsers.code}, "transaction":transaction, "lock":transaction.LOCK.UPDATE});
    });

    it('should failed findOneUser and return a error without transaction', async () => {
        User.findOne.mockRejectedValue(new Error(`Database error`));

        await expect(findOneUser({ code:mockUsers.code, requestId: requestId })).rejects.toThrow(
            'Database query error: Database error'
        );

        expect(User.findOne).toHaveBeenCalledWith({"where": {"code": mockUsers.code}});
    });

    it('should failed findOneUser and return a error with transaction', async () => {
        User.findOne.mockRejectedValue(new Error(`Database error`));

        await expect(findOneUser({code:mockUsers.code, requestId:requestId, transaction:transaction})).rejects.toThrow(
            'Database query error: Database error'
        );

        expect(User.findOne).toHaveBeenCalledWith({"where": {"code": mockUsers.code}, "transaction":transaction, "lock":transaction.LOCK.UPDATE});
    });
})

describe('update user || User Repository unit test' ,()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    const mockUsers= {
        code: "M013",
        name: "test name",
        quota: 2,
        updated_at: "2024-08-19T12:07:32.081Z",
        created_at: "2024-08-19T12:07:32.081Z",
        id: 1,
        penalty_date: null,
        deleted_at: null,
    }
    const transaction = {
        LOCK : {
            UPDATE : 'UPDATE'
        }
    }
    const requestId="Test-id"
    const params = {
        quota:1
    }
    it('should success update and return [1] without transaction', async () => {
        User.update.mockResolvedValue([1])

        const result = await update({params:params,code:mockUsers.code, requestId:requestId})

        expect(result).toEqual([1]);
        expect(User.update).toHaveBeenCalledWith(params,{"where": {"code": mockUsers.code}});
    });

    it('should success update and return [1] with transaction', async () => {
        User.update.mockResolvedValue([1])

        const result = await update({params:params,code:mockUsers.code, requestId:requestId, transaction:transaction})

        expect(result).toEqual([1]);
        expect(User.update).toHaveBeenCalledWith(params,{"where": {"code": mockUsers.code}, "transaction":transaction, "lock":transaction.LOCK.UPDATE});
    });

    it('should error update a user and return error without transaction', async () => {
        User.update.mockRejectedValue(new Error(`Database error`));

        expect(update({params, code:mockUsers.code, requestId: requestId })).rejects.toThrow(
            'Database query error: Database error'
        );
        expect(User.update).toHaveBeenCalledWith(params,{"where": {"code": mockUsers.code}});
    });

    it('should error update a user and return error with transaction', async () => {
        User.update.mockRejectedValue(new Error(`Database error`));

        expect(update({params, code:mockUsers.code, requestId: requestId, transaction:transaction })).rejects.toThrow(
            'Database query error: Database error'
        );
        expect(User.update).toHaveBeenCalledWith(params,{"where": {"code": mockUsers.code}, "transaction": transaction, "lock": transaction.LOCK.UPDATE});
    });
})