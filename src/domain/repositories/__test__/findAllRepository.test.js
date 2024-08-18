const {findAll} = require('../userRepository')
const {
    sequelize,
    Sequelize,

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