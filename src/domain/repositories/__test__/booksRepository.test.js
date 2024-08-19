const {findAllBook} = require('../bookRepository')
const {
    sequelize,
    Sequelize,
} = require("../../../infrastructure/database/models");
const models = require('../../../infrastructure/database/models');
const {findAll} = require("../userRepository");
const Book = models.Book

jest.mock('../../../infrastructure/database/models', () => {
    const actualSequelize = jest.requireActual('sequelize');
    const SequelizeMock = jest.fn(() => ({
        query: jest.fn(),
    }));
    SequelizeMock.Sequelize = actualSequelize.Sequelize;

    return {
        sequelize: new SequelizeMock(),
        Sequelize: actualSequelize.Sequelize,
        Book: {
            count: jest.fn(),
            findAll: jest.fn()
        },
    };
});

describe('findAllBookRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return books and total book count', async () => {
        const mockBooks=[
            {
                id: 1,
                code: "JK-01",
                title: "Books Testing",
                author: "Books author testing",
                stock: 1,
                created_at: "2024-08-18T12:40:08.128Z",
                updated_at: "2024-08-18T12:40:08.128Z",
                deleted_at: null
            },
        ]
        const  mockTotalBook=10

        Book.findAll.mockResolvedValue(mockBooks)
        Book.count.mockResolvedValue(mockTotalBook)


        const result = await findAllBook({ limit: 10, offset: 0, requestId: 'test-id' });

        expect(result.books).toEqual(mockBooks);
        expect(result.totalBook).toBe(mockTotalBook);
        expect(Book.findAll).toHaveBeenCalledWith(expect.any(Object));
        expect(Book.count).toHaveBeenCalledWith({ where: { deleted_at: null } });

    });

    it('should handle database errors gracefully', async ()=>{
        Book.findAll.mockRejectedValue(new Error(`Database error`));
        Book.count.mockResolvedValue(0)

        await expect(findAllBook({ limit: 10, offset: 0, requestId: 'test-id' })).rejects.toThrow(
            'Database query error: Database error'
        );

        expect(Book.findAll).toHaveBeenCalledWith(expect.any(Object));

    })
})
