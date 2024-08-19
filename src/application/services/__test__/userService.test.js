const userRepository = require("../../../domain/repositories/userRepository");
const {findAllUser,createUser} = require("../userService");

jest.mock("../../../domain/repositories/userRepository");

describe("findAll User Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return users and total user on success', async () => {
        const mockUsers = [
            {
                user_code: '123',
                name: 'John Doe',
                quota: 5,
                penalty_date: null,
                book_borrowed: [],
                created_at: '2023-01-01',
            },
        ]
        const mockResponse = {
            users: mockUsers,
            totalUser:10
        }
        userRepository.findAll.mockResolvedValue(mockResponse)
        const result = await findAllUser({ limit: 10, offset: 1, requestId: 'test-id' })

        expect(result).toEqual({
            request_id: 'test-id',
            code: 200,
            status: "Success",
            message: "Success Retrieve Data Users",
            data: {
                currentPage: 1,
                totalPages: 1,
                totalPerPage: 10,
                totalContent: 10,
                content: mockUsers,
            },
        })

        expect(userRepository.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0, requestId: 'test-id' })
    });
    it('should handle repository errors', async () => {
        userRepository.findAll.mockRejectedValue(new Error('Database query error: Database error'))

        const result = await findAllUser({ limit: 10, offset: 1, requestId: 'test-id' })

        expect(result).toEqual({
            request_id: 'test-id',
            code: 500,
            status: "Error",
            message: "Internal Server Error",
            data: null,
        })
        expect(userRepository.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0, requestId: 'test-id' })
    });
})

describe("create User Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should success create users return users data', async () => {
        const mockUsersRepository = {
                code: "M013",
                name: "test name",
                quota: 2,
                updated_at: "2024-08-19T12:07:32.081Z",
                created_at: "2024-08-19T12:07:32.081Z",
                id: 1,
                penalty_date: null,
                deleted_at: null,
            }

        userRepository.insert.mockResolvedValue(mockUsersRepository)

        const params = {
            name:mockUsersRepository.name, quota:mockUsersRepository.quota
        }
        const result = await createUser({ name:mockUsersRepository.name, requestId: 'test-id' })

        expect(result).toEqual({
            request_id: "test-id",
            code:200,
            status: "Success",
            message: "Success Create Data Users",
            data: mockUsersRepository
        })

        expect(userRepository.insert).toHaveBeenCalledWith({ params, requestId: 'test-id' })
    });
    it('should handle insert user repository errors', async () => {
        userRepository.insert.mockRejectedValue(new Error('Database query error: Database error'))

        const result = await createUser({ name:"test", requestId: 'test-id' })
        const params = {
            name:"test", quota:2
        }
        expect(result).toEqual({
            request_id: 'test-id',
            code: 500,
            status: "Error",
            message: "Internal Server Error",
            data: null,
        })
        expect(userRepository.insert).toHaveBeenCalledWith({ params, requestId: 'test-id' })
    });
})