const bookRepository = require('../../../domain/repositories/bookRepository')
const {findAllBooks, createBooks} =require('../bookService')
const userRepository = require("../../../domain/repositories/userRepository");
const {findAllUser} = require("../userService");

jest.mock('../../../domain/repositories/bookRepository')
describe('findAllBooksService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return books and total book on success', async () => {
        const mockBooks = [
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
        const mockReturnFindAllBooks = {books: mockBooks, totalBook:10}
        bookRepository.findAllBook.mockReturnValue(mockReturnFindAllBooks)



        const result = await findAllBooks({limit:10, offset:1, requestId: 'test-id'})

        expect(result).toEqual({
            request_id: 'test-id',
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Books",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: mockBooks,
            },})
    });

    it('should handle repository errors', async () => {
       bookRepository.findAllBook.mockRejectedValue(new Error('Database error'))

        const result = await findAllBooks({limit:10, offset:1, requestId: 'test-id'})

        expect(result).toEqual({
            request_id: 'test-id',
            code: 500,
            status: "Error",
            message: "Internal Server Error",
            data: null,
        })

    });
})

describe('createBooks || create Book Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })
    const mockBooks ={
            id: 1,
            code: "JK-01",
            title: "Books Testing",
            author: "Books author testing",
            stock: 1,
            created_at: "2024-08-18T12:40:08.128Z",
            updated_at: "2024-08-18T12:40:08.128Z",
            deleted_at: null
        }
    const requestId = "test-id"
    const params={
        code:mockBooks.code,
        title:mockBooks.title,
        author:mockBooks.author,
        stock:mockBooks.stock,
        requestId:requestId
    }
    const inserRepo = {
        code:mockBooks.code,
        author:mockBooks.author,
        stock:mockBooks.stock,
        title:mockBooks.title,
    }
    it('should success create books', async () => {

        bookRepository.findOneBook.mockReturnValue(null)
        bookRepository.insert.mockReturnValue(mockBooks)

        const result = await createBooks(params)

        expect(result).toEqual({
            request_id: requestId,
            code: 201,
            status: "Success",
            message: "Success Create Books",
            data: mockBooks
        })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({code:mockBooks.code, requestId:requestId})
        expect(bookRepository.findOneBook).toHaveBeenCalled()
        expect(bookRepository.insert).toHaveBeenCalledWith({params:inserRepo,requestId})
        expect(bookRepository.insert).toHaveBeenCalled()
    });

    it('should failed create books with error Validation code already exist || create book service', async () => {
        bookRepository.findOneBook.mockReturnValue(mockBooks)
        const result = await createBooks(params)

        expect(result).toEqual({
            request_id: requestId,
            code:400,
            status: "Error",
            message: "Code already exists",
            data: null
        })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({code:mockBooks.code, requestId:requestId})
        expect(bookRepository.findOneBook).toHaveBeenCalled()
    });

    it('should failed create books with error When insert book in repository || create book service', async () => {
        bookRepository.findOneBook.mockReturnValue(null)
        bookRepository.insert.mockRejectedValue(new Error("Database error"))

        const result = await createBooks(params)

        expect(result).toEqual({
            request_id: requestId,
            code:500,
            status: "Error",
            message: "Internal Server Error",
            data: null
        })
        expect(bookRepository.findOneBook).toHaveBeenCalledWith({code:mockBooks.code, requestId:requestId})
        expect(bookRepository.findOneBook).toHaveBeenCalled()
        expect(bookRepository.insert).toHaveBeenCalledWith({params:inserRepo,requestId})
        expect(bookRepository.insert).toHaveBeenCalled()
    });
})