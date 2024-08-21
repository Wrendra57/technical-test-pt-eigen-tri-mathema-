const app = require('../app')
const request = require('supertest')
const models = require('../infrastructure/database/models')
const {sequelize} = require("../infrastructure/database/models");
const borrowRepository = require("../domain/repositories/borrowRepository");
const userRepository = require("../domain/repositories/userRepository");
const User = models.User
const Book = models.Book
const Borrow = models.Borrow

beforeAll( (done) => {
    server = app.listen(done);
});

afterAll((done) => {
    server.close(done);
});

describe('Test Create Borrow', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    const url = '/api/borrows'
    it('should return 201 OK create borrow and return data user', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'JK-45',
                codeUser: 'M001'
            })
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.status).toEqual("Success")
                expect(res.body.message).toEqual("Success Create Borrow")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 201 OK create borrow and return data user || penalty to be null', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-44',
                codeUser: 'M004'
            })
            .then((res) => {
                expect(res.status).toBe(201);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.status).toEqual("Success")
                expect(res.body.message).toEqual("Success Create Borrow")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });
    it('should return 400 Error Validation Code User || Code User is required', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'JK-45',
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code User is required")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Code User || Code User must be at least 2', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'JK-45',
                codeUser: 'M'
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code User must be at least 2")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Code User || Code User must be maximum 10 characters', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'JK-45',
                codeUser: 'Mdawsdawdadwdw'
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code User must be maximum 10 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it("should return 400 Error Validation Code User || Code User must be Number, Alphabet, & '-'", async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'JK-45',
                codeUser: 'M-#2'
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code User must be Number, Alphabet, & '-'")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it("should return 400 Error Validation Code Book || Code Book is required", async () => {
        return request(server)
            .post(url)
            .send({
                codeUser: 'M-#2'
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code Book is required")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it("should return 400 Error Validation Code Book || Code Book must be at least 2", async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'J',
                codeUser: 'M-2'
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code Book must be at least 2")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it("should return 400 Error Validation Code Book || Code Book must be maximum 10 characters", async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'Jadwafasdwfaw',
                codeUser: 'M-2'
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code Book must be maximum 10 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it("should return 400 Error Validation Code Book || Code Book must be Number, Alphabet, & '-'", async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'JK-#4',
                codeUser: 'M-2'
            })
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code Book must be Number, Alphabet, & '-'")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 404 Error create borrow || not found user', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'JK-45',
                codeUser: 'M0001'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(404);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("User not found")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });
    it('should return 400 Error create borrow || Quota user 0', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-45',
                codeUser: 'M002'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Quota user 0")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error create borrow || User has penalty after', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-45',
                codeUser: 'M003'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).not.toEqual(null)
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 404 Error create borrow || Book not found', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-45333',
                codeUser: 'M005'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(404);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Book not found")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 404 Error create borrow || Book stock is 0', async () => {
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-43',
                codeUser: 'M006'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(404);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Book stock is 0")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 500 Internal server Error || userRepository.findOneUser', async () => {
        const mockUserFindOne= jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Database error'))
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-46',
                codeUser: 'M007'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.request_id).not.toBe(undefined)
            }).finally(() => {
                mockUserFindOne.mockRestore();

            });
    });

    it('should return 500 Internal server Error || bookRepository.findOneBook', async () => {
        const mockUserFindOne= jest.spyOn(Book, 'findOne').mockRejectedValue(new Error('Database error'))
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-46',
                codeUser: 'M007'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.request_id).not.toBe(undefined)
            }).finally(() => {
                mockUserFindOne.mockRestore();

            });
    });

    it('should return 500 Internal server Error ||  borrowRepository.insert', async () => {
        const mockBorrowCreate= jest.spyOn(Borrow, 'create').mockRejectedValue(new Error('Database error'))
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-46',
                codeUser: 'M007'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.request_id).not.toBe(undefined)
            }).finally(() => {
                mockBorrowCreate.mockRestore();

            });
    });

    it('should return 500 Internal server Error ||   userRepository.update', async () => {
        const mockUserUpdate= jest.spyOn(User, 'update').mockRejectedValue(new Error('Database error'))
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-46',
                codeUser: 'M007'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.request_id).not.toBe(undefined)
            }).finally(() => {
                mockUserUpdate.mockRestore();
            });
    });

    it('should return 500 Internal server Error || bookRepository.update', async () => {
        const mockBookUpdate= jest.spyOn(Book, 'update').mockRejectedValue(new Error('Database error'))
        return request(server)
            .post(url)
            .send({
                codeBook: 'FM-46',
                codeUser: 'M007'
            })
            .then((res) => {
                console.info(res.body)
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.request_id).not.toBe(undefined)
            }).finally(() => {
                mockBookUpdate.mockRestore();
            });
    });


})
