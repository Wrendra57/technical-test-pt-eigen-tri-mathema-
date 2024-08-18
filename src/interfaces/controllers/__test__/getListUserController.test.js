const userService = require('../../../application/services/userService');
const toTemplateResponseApi = require('../../../interfaces/utils/templateResponeApi');
const {getListUser} = require("../userController");
jest.mock('../../../application/services/userService')
jest.mock('../../utils/templateResponeApi')

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

    it('should return user and pagination detail on success', async () => {
        const mockUsers = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Users",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: [{ user_code: '123', name: 'John Doe' }],
            }
        }
        userService.findAllUser.mockResolvedValue(mockUsers)
        toTemplateResponseApi.mockReturnValue({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data})

        req.query.limit='10';
        req.query.page='1';

        await getListUser(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data});
        expect(userService.findAllUser).toHaveBeenCalledWith({ limit: 10, offset: 1, requestId: 'test-id' });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockUsers);
    });

    it('should return user and pagination with undefined query limit', async () => {
        const mockUsers = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Users",
            data: {
                currentPage: 1,
                totalPages: 2,
                totalPerPage: 5,
                totalContent: 10,
                content: [{ user_code: '123', name: 'John Doe' }],
            }
        }
        userService.findAllUser.mockResolvedValue(mockUsers)
        toTemplateResponseApi.mockReturnValue({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data})

        req.query.page='1';

        await getListUser(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data});
        expect(userService.findAllUser).toHaveBeenCalledWith({ limit: 5, offset: 1, requestId: 'test-id' });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockUsers);
    });
    it('should return user and pagination with empty query limit', async () => {
        const mockUsers = {
            request_id:"x-request-id",
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Users",
            data: {
                currentPage: 1,
                totalPages: 2,
                totalPerPage: 5,
                totalContent: 10,
                content: [{ user_code: '123', name: 'John Doe' }],
            }
        }
        userService.findAllUser.mockResolvedValue(mockUsers)
        toTemplateResponseApi.mockReturnValue({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data})
        req.query.limit='';
        req.query.page='1';

        await getListUser(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data});
        expect(userService.findAllUser).toHaveBeenCalledWith({ limit: 5, offset: 1, requestId: 'test-id' });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockUsers);
    });

    it('should return user and pagination with invalid query limit', async () => {
        const mockUsers = {
            request_id:req.requestId,
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Users",
            data: {
                currentPage: 1,
                totalPages: 2,
                totalPerPage: 5,
                totalContent: 10,
                content: [{ user_code: '123', name: 'John Doe' }],
            }
        }
        userService.findAllUser.mockResolvedValue(mockUsers)
        toTemplateResponseApi.mockReturnValue({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data})

        req.query.limit='1w';
        req.query.page='1';

        await getListUser(req,res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockUsers.request_id,
            status: "Error",
            message: "Limit Must Be Positive Number",
            data: null});
        expect(userService.findAllUser).toBeCalledTimes(0)
        expect(toTemplateResponseApi).toBeCalledTimes(0);
    });

    it('should return user and pagination with undefined query offset', async () => {
        const mockUsers = {
            request_id:req.requestId,
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Users",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: req.query.limit,
                totalContent: 10,
                content: [{ user_code: '123', name: 'John Doe' }],
            }
        }
        userService.findAllUser.mockResolvedValue(mockUsers)
        toTemplateResponseApi.mockReturnValue({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data})

        req.query.limit='10';

        await getListUser(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data});
        expect(userService.findAllUser).toHaveBeenCalledWith({ limit: 10, offset: 1, requestId: req.requestId });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockUsers);
    });
    it('should return user and pagination with empty query offset', async () => {
        const mockUsers = {
            request_id:req.requestId,
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Users",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: req.query.limit,
                totalContent: 10,
                content: [{ user_code: '123', name: 'John Doe' }],
            }
        }
        userService.findAllUser.mockResolvedValue(mockUsers)
        toTemplateResponseApi.mockReturnValue({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data})
        req.query.limit='10';
        req.query.page='';

        await getListUser(req,res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ request_id: mockUsers.request_id,
            status: mockUsers.status,
            message: mockUsers.message,
            data: mockUsers.data});
        expect(userService.findAllUser).toHaveBeenCalledWith({ limit: 10, offset: 1, requestId: req.requestId });
        expect(toTemplateResponseApi).toHaveBeenCalledWith(mockUsers);
    });

    it('should return user and pagination with invalid query offset', async () => {

        req.query.limit='10';
        req.query.page='1w';

        await getListUser(req,res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ request_id: req.requestId,
            status: "Error",
            message: "Offset Must Be Positive Number",
            data: null});
        expect(userService.findAllUser).toBeCalledTimes(0)
        expect(toTemplateResponseApi).toBeCalledTimes(0);
    });
})
