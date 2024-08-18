const bookService = require('../../../../application/services/bookService')
const toTemplateResponseApi = require('../../../utils/templateResponeApi');
const {getListBooks} = require('../../bookController');


jest.mock('../../../../application/services/bookService')
jest.mock('../../../utils/templateResponeApi')

describe('get list user', () => {
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
