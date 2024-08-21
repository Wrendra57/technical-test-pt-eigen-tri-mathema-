const {findAllBook, insert, findOneBook,update} = require('../bookRepository')
const {
    sequelize,
    Sequelize,
} = require("../../../infrastructure/database/models");
const models = require('../../../infrastructure/database/models');
const {Error} = require("sequelize");
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
            findAll: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn()
        },
    };
});

describe('findAllBookRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
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
    it('should return books and total book count', async () => {



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

describe('createBookRepository || Book Repository',  ()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should success create book return books', async ()=>{
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
        Book.create.mockResolvedValue(mockBooks)

        const params = {
            code:mockBooks.code,
            author:mockBooks.author,
            stock:mockBooks.stock,
            title:mockBooks.title,
        }
        const result = await insert({ params, requestId: 'test-id' });

        expect(result).toEqual(mockBooks);
        expect(Book.create).toHaveBeenCalledWith(params);
    })

    it('should failed create book return error', async ()=>{
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
        Book.create.mockRejectedValue(new Error(`Database error`));

        const params = {
            code:mockBooks.code,
            author:mockBooks.author,
            stock:mockBooks.stock,
            title:mockBooks.title,
        }
       await expect(insert({ params, requestId: 'test-id' })).rejects.toThrow(
            'Database query error: Database error'
        );

        expect(Book.create).toHaveBeenCalledWith(params);
    })
})

describe('findOneBook || Book Repository',  ()=>{

    afterEach(() => {
        jest.clearAllMocks();
    });

    const transaction = {
        LOCK : {
            UPDATE : 'UPDATE'
        }
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
    it('should success find a book and return books without transaction', async ()=>{

        Book.findOne.mockResolvedValue(mockBooks)

        const result = await findOneBook({ code:mockBooks.code, requestId: 'test-id' });

        expect(result).toEqual(mockBooks);
        expect(Book.findOne).toHaveBeenCalledWith({"where": {"code": mockBooks.code}});
    })

    it('should success find a book and return books with transaction', async ()=>{

        Book.findOne.mockResolvedValue(mockBooks)

        const result = await findOneBook({ code:mockBooks.code, requestId: 'test-id', transaction:transaction });

        expect(result).toEqual(mockBooks);
        expect(Book.findOne).toHaveBeenCalledWith({"where": {"code": mockBooks.code},"lock":"UPDATE", transaction:transaction });
    })

    it('should null find a book and return books', async ()=>{
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
        Book.findOne.mockResolvedValue(null)

        const result = await findOneBook({ code:mockBooks.code, requestId: 'test-id' });

        expect(result).toEqual(null);
        expect(Book.findOne).toHaveBeenCalledWith({"where": {"code": mockBooks.code}});
    })

    it('should failed find book return error', async ()=>{
        Book.findOne.mockRejectedValue(new Error(`Database error`));

        await expect(findOneBook({ code:mockBooks.code, requestId: 'test-id' })).rejects.toThrow(
            'Database query error: Database error'
        );

        expect(Book.findOne).toHaveBeenCalledWith({"where": {"code": mockBooks.code}});
    })
})

describe('update book || Book Repository', ()=> {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const transaction = {
        LOCK : {
            UPDATE : 'UPDATE'
        }
    }
    const params = {
        quota : 1
    }
    const requestId="Test-id"
    const code = "MH-01"
    it('should success update a book and return array [1] without transaction', async () => {
        Book.update.mockResolvedValue([1])

        const result = await update({params, code:code, requestId: requestId});
        expect(result).toEqual([1]);
        expect(Book.update).toHaveBeenCalledWith(params,{"where": {"code": code}});
    });
    it('should success update a book and return array [1] with transaction', async () => {
        Book.update.mockResolvedValue([1])

        const result = await update({params, code:code, requestId: requestId, transaction});
        expect(result).toEqual([1]);
        expect(Book.update).toHaveBeenCalledWith(params,{"where": {"code": code}, "transaction": transaction, "lock": transaction.LOCK.UPDATE});
    });

    it('should error update a book and return error ', async () => {
        Book.update.mockRejectedValue(new Error(`Database error`));

        expect(update({params, code:code, requestId: requestId, transaction:transaction })).rejects.toThrow(
            'Database query error: Database error'
        );
        expect(Book.update).toHaveBeenCalledWith(params,{"where": {"code": code}, "transaction": transaction, "lock": transaction.LOCK.UPDATE});
    });
})