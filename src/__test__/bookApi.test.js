const app = require('../app')
const request = require("supertest");
const models = require('../infrastructure/database/models')
const Book = models.Book

beforeAll((done) => {
    server = app.listen(done);
});

afterAll((done) => {
    server.close(done);
});

jest.mock('../infrastructure/database/models', ()=>{
    return {
        Book:{
            count: jest.fn(),
            findAll: jest.fn()
        }
    }
})

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
        Book.findAll.mockRejectedValue(new Error(`Database error`));
        Book.count.mockResolvedValue(0)

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

            })
    })
})