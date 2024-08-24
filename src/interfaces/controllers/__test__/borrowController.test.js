const borrowService = require('../../../application/services/borrowService')
const {toTemplateResponseApi} = require("../../utils/templateResponeApi");
const {createBorrows,returnBorrows} = require("../borrowController");

jest.mock('../../../application/services/borrowService')
jest.mock("../../utils/templateResponeApi");

describe('create borrow || borrow controller', () => {
    let req,res
    beforeEach(()=>{
        req = {
            requestId:'test-id',
            body:{
                codeUser:'123',
                codeBook:'123'
            }
        }
        res = {
            status:jest.fn(()=>res),
            json:jest.fn()
        }
    })
    afterEach(()=>{
        jest.clearAllMocks()
    })

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
    const mockUser = {
        code: "M013",
        name: "test name",
        quota: 2,
        updated_at: "2024-08-19T12:07:32.081Z",
        created_at: "2024-08-19T12:07:32.081Z",
        id: 1,
        penalty_date: null,
        deleted_at: null,
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
    const data = {
        book:{
            code:mockBooks.code,
            title:mockBooks.title,
            author:mockBooks.author,
            stock:mockBooks.stock - 1,
        },
        user_id:{
            code:mockUser.code,
            name:mockUser.name,
            quota:mockUser.quota - 1,
            penalty_date:mockUser.penalty_date,
        },
        checkout_date: mockBorrow.checkout_at,
        due_date: mockBorrow.due_date,
    }
    const requestId = 'test-id'

    it('should return borrow data on success', async () => {
        const mockServiceResponse = {
            request_id: requestId,
            code:200,
            status: "Success",
            message: "Success Create Borrow",
            data: data
        }
        const mockToTemplateResponseApi = { request_id: mockServiceResponse.request_id,
            code: mockServiceResponse.code,
            status: mockServiceResponse.status,
            message: mockServiceResponse.message,
            data: mockServiceResponse.data}
        borrowService.createBorrows.mockResolvedValue(mockServiceResponse)
        toTemplateResponseApi.mockReturnValue(mockToTemplateResponseApi)

        await createBorrows(req,res)

        expect(res.status).toHaveBeenCalledWith(mockServiceResponse.code)
        expect(res.json).toHaveBeenCalledWith(mockToTemplateResponseApi)
        expect(borrowService.createBorrows).toHaveBeenCalledWith({codeUser:req.body.codeUser, codeBook:req.body.codeBook, requestId})
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockServiceResponse)
        });

    it('should return error 400', async () => {
        const mockServiceResponse = {
            request_id: requestId,
            code:400,
            status: "Error",
            message: "Book stock is 0",
            data: null
        }
        const mockToTemplateResponseApi = { request_id: mockServiceResponse.request_id,
            code: mockServiceResponse.code,
            status: mockServiceResponse.status,
            message: mockServiceResponse.message,
            data: mockServiceResponse.data}
        borrowService.createBorrows.mockResolvedValue(mockServiceResponse)
        toTemplateResponseApi.mockReturnValue(mockToTemplateResponseApi)

        await createBorrows(req,res)

        expect(res.status).toHaveBeenCalledWith(mockServiceResponse.code)
        expect(res.json).toHaveBeenCalledWith(mockToTemplateResponseApi)
        expect(borrowService.createBorrows).toHaveBeenCalledWith({codeUser:req.body.codeUser, codeBook:req.body.codeBook, requestId})
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockServiceResponse)
    });

    it('should return error 500', async () => {
        const mockServiceResponse = {
            request_id: requestId,
            code:500,
            status: "Error",
            message: "Internal Server Error",
            data: null
        }
        const mockToTemplateResponseApi = { request_id: mockServiceResponse.request_id,
            code: mockServiceResponse.code,
            status: mockServiceResponse.status,
            message: mockServiceResponse.message,
            data: mockServiceResponse.data}
        borrowService.createBorrows.mockResolvedValue(mockServiceResponse)
        toTemplateResponseApi.mockReturnValue(mockToTemplateResponseApi)

        await createBorrows(req,res)

        expect(res.status).toHaveBeenCalledWith(mockServiceResponse.code)
        expect(res.json).toHaveBeenCalledWith(mockToTemplateResponseApi)
        expect(borrowService.createBorrows).toHaveBeenCalledWith({codeUser:req.body.codeUser, codeBook:req.body.codeBook, requestId})
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockServiceResponse)
    });
})

describe('Borrow Controller - returnBorrows', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            requestId: 'Test-id',
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully return a borrow record', async () => {
        const mockResponse = { code: 200, data: { getBorrow: {} }, message: 'Success Return Borrow' };
        borrowService.returnBorrows.mockResolvedValue(mockResponse);
        toTemplateResponseApi.mockReturnValue(mockResponse);

        req.body.borrow_id = 1;

        await returnBorrows(req, res);

        expect(borrowService.returnBorrows).toHaveBeenCalledWith({
            borrowId: 1,
            codeUser: undefined,
            codeBook: undefined,
            requestId: 'Test-id',
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should fail to return a borrow record when neither borrowId nor both codeUser and codeBook are provided', async () => {
        req.body.code_user = 'M001';

        await returnBorrows(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            request_id: 'Test-id',
            status: 'Error',
            message: 'Either Borrow ID or both Code Book and Code User are required',
            data: null,
        });
    });

    it('should fail to return a borrow record due to service error', async () => {
        const mockErrorResponse = { code: 500, message: 'Internal Server Error' };
        borrowService.returnBorrows.mockResolvedValue(mockErrorResponse);
        toTemplateResponseApi.mockReturnValue(mockErrorResponse);

        req.body.borrow_id = 1;

        await returnBorrows(req, res);

        expect(borrowService.returnBorrows).toHaveBeenCalledWith({
            borrowId: 1,
            codeUser: undefined,
            codeBook: undefined,
            requestId: 'Test-id',
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(mockErrorResponse);
    });
});