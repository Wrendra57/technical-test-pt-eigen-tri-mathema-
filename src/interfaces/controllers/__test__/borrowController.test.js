const borrowService = require('../../../application/services/borrowService')
const {toTemplateResponseApi} = require("../../utils/templateResponeApi");
const {createBorrows} = require("../borrowController");

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
