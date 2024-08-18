const userRepository = require("../../../domain/repositories/userRepository");
const {findAllUser} = require("../userService");

jest.mock("../../../domain/repositories/userRepository");

describe("findAllUsers", () => {
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
        console.info(result)
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