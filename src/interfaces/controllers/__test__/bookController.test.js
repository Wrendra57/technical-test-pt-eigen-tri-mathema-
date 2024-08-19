const bookService = require('../../../application/services/bookService')
const toTemplateResponseApi = require('../../utils/templateResponeApi');
const {getListBooks, createBook} = require('../bookController');
const userService = require("../../../application/services/userService");


jest.mock('../../../application/services/bookService')
jest.mock('../../utils/templateResponeApi')

describe('get list book', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            query: {},
            requestId: 'test-id',
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    })
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
    it('should return books and pagination detail on success', async () => {
        const mockBooksService = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Books",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: mockBooks,
            }
        }

        toTemplateResponseApi.mockReturnValue({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data})
        bookService.findAllBooks.mockResolvedValue(mockBooksService)

        req.query.limit='10';
        req.query.page='1';

        await getListBooks(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data});
        expect(bookService.findAllBooks).toHaveBeenCalledWith({ limit: 10, offset: 1, requestId: 'test-id' });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockBooksService);
    });

    it('should return user and pagination with undefined query limit', async () => {
        const mockBooksService = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Books",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: mockBooks,
            }
        }

        toTemplateResponseApi.mockReturnValue({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data})
        bookService.findAllBooks.mockResolvedValue(mockBooksService)

        req.query.page='1';

        await getListBooks(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data});
        expect(bookService.findAllBooks).toHaveBeenCalledWith({ limit: 5, offset: 1, requestId: 'test-id' });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockBooksService);
    });

    it('should return user and pagination with empty query limit', async () => {
        const mockBooksService = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Books",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: mockBooks,
            }
        }

        toTemplateResponseApi.mockReturnValue({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data})
        bookService.findAllBooks.mockResolvedValue(mockBooksService)

        req.query.limit='';
        req.query.page='1';

        await getListBooks(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data});
        expect(bookService.findAllBooks).toHaveBeenCalledWith({ limit: 5, offset: 1, requestId: 'test-id' });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockBooksService);
    });

    it('should return user and pagination with invalid query limit', async () => {
        const mockBooksService = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Books",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: mockBooks,
            }
        }

        toTemplateResponseApi.mockReturnValue({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data})
        bookService.findAllBooks.mockResolvedValue(mockBooksService)

        req.query.limit='10w';
        req.query.page='1';

        await getListBooks(req,res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ request_id: req.requestId,
            status: "Error",
            message: "Limit Must Be Positive Number",
            data: null});
        expect(bookService.findAllBooks).toBeCalledTimes(0);
        expect(toTemplateResponseApi).toBeCalledTimes(0);
    });

    it('should return user and pagination with undefined query offset', async () => {
        const mockBooksService = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Books",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: mockBooks,
            }
        }

        toTemplateResponseApi.mockReturnValue({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data})
        bookService.findAllBooks.mockResolvedValue(mockBooksService)

        req.query.limit="5"


        await getListBooks(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data});
        expect(bookService.findAllBooks).toHaveBeenCalledWith({ limit: 5, offset: 1, requestId: 'test-id' });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockBooksService);
    });

    it('should return user and pagination with empty query offset', async () => {
        const mockBooksService = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Books",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: mockBooks,
            }
        }

        toTemplateResponseApi.mockReturnValue({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data})
        bookService.findAllBooks.mockResolvedValue(mockBooksService)

        req.query.limit='5';
        req.query.page='';

        await getListBooks(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data});
        expect(bookService.findAllBooks).toHaveBeenCalledWith({ limit: 5, offset: 1, requestId: 'test-id' });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockBooksService);
    });

    it('should return user and pagination with invalid query offset', async () => {
        const mockBooksService = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Books",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: mockBooks,
            }
        }

        toTemplateResponseApi.mockReturnValue({ request_id: mockBooksService.request_id,
            status: mockBooksService.status,
            message: mockBooksService.message,
            data: mockBooksService.data})
        bookService.findAllBooks.mockResolvedValue(mockBooksService)

        req.query.limit='10';
        req.query.page='1w';

        await getListBooks(req,res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ request_id: req.requestId,
            status: "Error",
            message: "Offset Must Be Positive Number",
            data: null});
        expect(bookService.findAllBooks).toBeCalledTimes(0);
        expect(toTemplateResponseApi).toBeCalledTimes(0);
    });
})

describe('create book test || Create Book Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            query: {},
            body:{},
            requestId: 'test-id',
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    })

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
        // const requestId = ""
    const params={
        code:mockBooks.code,
        title:mockBooks.title,
        author:mockBooks.author,
        stock:mockBooks.stock,
        requestId: "test-id"
    }
    it('should success create book and return book data', async () => {
        const mockServiceResponse = {
            request_id: "test-id",
            code:200,
            status: "Success",
            message: "Success Create Books",
            data: mockBooks
        }
        bookService.createBooks.mockResolvedValue(mockServiceResponse)
        toTemplateResponseApi.mockReturnValue({ request_id: mockServiceResponse.request_id,
            status: mockServiceResponse.status,
            message: mockServiceResponse.message,
            data: mockServiceResponse.data})

        req.body.code = mockBooks.code
        req.body.title = mockBooks.title
        req.body.author = mockBooks.author
        req.body.stock = mockBooks.stock

        await createBook(req,res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockServiceResponse.request_id,
            status: mockServiceResponse.status,
            message: mockServiceResponse.message,
            data: mockServiceResponse.data});
        expect(bookService.createBooks).toHaveBeenCalledWith(params);
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockServiceResponse);
    });

    it('should failed create book and return error code already exist', async () => {
        const mockServiceResponse = {
            request_id: "test-id",
            code:400,
            status: "Error",
            message: "Code already exists",
            data: null
        }
        bookService.createBooks.mockResolvedValue(mockServiceResponse)
        toTemplateResponseApi.mockReturnValue({ request_id: mockServiceResponse.request_id,
            status: mockServiceResponse.status,
            message: mockServiceResponse.message,
            data: mockServiceResponse.data})

        req.body.code = mockBooks.code
        req.body.title = mockBooks.title
        req.body.author = mockBooks.author
        req.body.stock = mockBooks.stock

        await createBook(req,res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockServiceResponse.request_id,
            status: mockServiceResponse.status,
            message: mockServiceResponse.message,
            data: mockServiceResponse.data});
        expect(bookService.createBooks).toHaveBeenCalledWith(params);
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockServiceResponse);
    });

    it('should failed create book and return internal server error', async () => {
        const mockServiceResponse = {
            request_id: "test-id",
            code:500,
            status: "Error",
            message: "Internal Server Error",
            data: null
        }
        bookService.createBooks.mockResolvedValue(mockServiceResponse)
        toTemplateResponseApi.mockReturnValue({ request_id: mockServiceResponse.request_id,
            status: mockServiceResponse.status,
            message: mockServiceResponse.message,
            data: mockServiceResponse.data})

        req.body.code = mockBooks.code
        req.body.title = mockBooks.title
        req.body.author = mockBooks.author
        req.body.stock = mockBooks.stock

        await createBook(req,res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockServiceResponse.request_id,
            status: mockServiceResponse.status,
            message: mockServiceResponse.message,
            data: mockServiceResponse.data});
        expect(bookService.createBooks).toHaveBeenCalledWith(params);
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockServiceResponse);
    });
})