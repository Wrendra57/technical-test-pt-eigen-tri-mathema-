const {findAll, insert} = require('../userRepository')
const {
    sequelize,
} = require("../../../infrastructure/database/models/index.js");
const models = require('../../../infrastructure/database/models/index.js');
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
        },
    };
});

describe('findAllUserRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return users and total user count', async () => {
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
    it('should success create user and return user data', async () => {
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