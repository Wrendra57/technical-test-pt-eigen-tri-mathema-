const app = require('../app')
const request = require("supertest");
const models = require('../infrastructure/database/models')
const {sequelize} = require("../infrastructure/database/models");
const Book = models.Book

beforeAll((done) => {
    server = app.listen(done);
});

afterAll((done) => {
    server.close(done);
});


describe('Test List Book || GET Test API /api/books', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it ('should return 200 OK and list books', async () => {
        const limit = 10
        const page = 1
        const url = `/api/books?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)

            })
    })
    it ('should return 200 OK and list books with undefined limit', async () => {

        const page = 1
        const url = `/api/books?page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.message).toEqual("Success Retrieve Data Books")
                expect(res.body.status).toEqual("Success")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })
    it ('should return 200 OK and list books with empty limit', async () => {
        const limit = ""
        const page = 1
        const url = `/api/books?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.message).toEqual("Success Retrieve Data Books")
                expect(res.body.status).toEqual("Success")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })
    it ('should return 400 Error with invalid limit', async () => {
        const limit = "1a"
        const page = "1"
        const url = `/api/books?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.message).toEqual("Limit Must Be Positive Number")
                expect(res.body.status).toEqual("Error")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })
    it ('should return 200 OK and list books with undefined offset', async () => {
        const limit = "10"

        const url = `/api/books?limit=${limit}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.message).toEqual("Success Retrieve Data Books")
                expect(res.body.status).toEqual("Success")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })
    it ('should return 200 OK and list books with empty offset', async () => {
        const limit = "10"
        const page = ""
        const url = `/api/books?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.message).toEqual("Success Retrieve Data Books")
                expect(res.body.status).toEqual("Success")
                expect(res.body.request_id).not.toBe(undefined)

            })
    })
    it ('should return 400 Error with invalid offset', async () => {
        const limit = "10"
        const page = "1a"
        const url = `/api/books?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.message).toEqual("Offset Must Be Positive Number")
                expect(res.body.status).toEqual("Error")
                expect(res.body.request_id).not.toBe(undefined)

            })
    })
    it ('should return 500 Error with internal server error', async () => {


        const mockfindAll = jest.spyOn(Book, 'findAll').mockRejectedValue(new Error(`Database error`));
        const mockCount = jest.spyOn(Book, 'count').mockResolvedValue(0);

        const limit = "10"
        const page = "1"
        const url = `/api/books?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.status).toEqual("Error")
                expect(res.body.request_id).not.toBe(undefined)

            }).finally(() => {
                mockfindAll.mockRestore();  // Restore mocking setelah selesai
                mockCount.mockRestore();
            });
    })
})

describe('Test Create Book || POST Test API /api/books', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    const url = "/api/books"
    const random = Math.random().toString(36).substring(2, 6);
    const maxStr = "KLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.\\n"
    it('should return 200 OK create book and return data book', async () => {

        const body = {code: `KM-1${random}`,
           title: "Test Book",
           author: "John Doe",
           stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.status).toEqual("Success")
                expect(res.body.message).toEqual("Success Create Books")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Code is Required', async () => {
        const body = {
            title: "Test Book",
            author: "John Doe",
            stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code is required")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Code Min Length 2 ', async () => {
        const body = { code: `K`,
            title: "Test Book",
            author: "John Doe",
            stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code must be at least 2 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Code Max Length 255 ', async () => {
        const body = { code: `KLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.\\n"`,
            title: "Test Book",
            author: "John Doe",
            stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code must be maximum 10 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Title is required ', async () => {
        const body = { code:`KM-1${random}`,
            author: "John Doe",
            stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Title is required")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Title Min Length 2 ', async () => {
        const body = { code: `K-1${random}`,
            title: "T",
            author: "John Doe",
            stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Title must be at least 2 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Title Max Length 255 ', async () => {
        const body = { code: `KLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.\\n"`,
            title: maxStr,
            author: "John Doe",
            stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Title must be maximum 255 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Author is required ', async () => {
        const body = { code:`KM-1${random}`,
            title: "Test book",
            stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Author is required")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Author Min Length 2 ', async () => {
        const body = { code: `K-1${random}`,
            title: "Test book",
            author: "J",
            stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Author must be at least 2 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Author Max Length 255 ', async () => {
        const body = {  code: `K-1${random}`,
            title: "Test book",
            author: maxStr,
            stock: 3}

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Author must be maximum 255 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });
    it('should return 400 Error Validation Stock is required', async () => {
        const body = {  code: `K-1${random}`,
            title: "Test book",
            author: "dwaadw"
            }

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Stock is required")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Stock must be number', async () => {
        const body = {  code: `K-1${random}`,
            title: "Test book",
            author: "dwdw",
            stock:"4e"
        }

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Stock must be number")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Error Validation Stock must be at least 1', async () => {
        const body = {  code: `K-1${random}`,
            title: "Test book",
            author: "dwdw",
            stock:-2
        }

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Stock must be at least 1")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });
    it('should return 400 Error Validation Stock must be integer', async () => {
        const body = {  code: `K-1${random}`,
            title: "Test book",
            author: "dwdw",
            stock:3.4
        }

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Stock must be integer")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 400 Code already exist', async () => {
        const body = {  code: `JK-45`,
            title: "Test book",
            author: "dwdw",
            stock:3
        }

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Code already exists")
                expect(res.body.request_id).not.toBe(undefined)
            })
    });

    it('should return 500 database Error find one repository', async () => {
        const mockFind = jest.spyOn(Book, 'findOne').mockRejectedValue(new Error("Database Error"));

        const body = {  code: `K-1${random}`,
            title: "Test book",
            author: "dwdw",
            stock:3
        }

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.request_id).not.toBe(undefined)
            }).finally(() => {
                mockFind.mockRestore();

            });
    });

    it('should return 500 database Error create repository', async () => {
        const mockFind = jest.spyOn(Book, 'create').mockRejectedValue(new Error("Database Error"));

        const body = {  code: `K-1${random}`,
            title: "Test book",
            author: "dwdw",
            stock:3
        }

        return request(server)
            .post(url)
            .send(body)
            .then((res)=>{
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.request_id).not.toBe(undefined)
            }).finally(() => {
                mockFind.mockRestore();

            });
    });
})
