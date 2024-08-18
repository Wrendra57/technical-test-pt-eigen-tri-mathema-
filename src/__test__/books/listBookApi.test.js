const app = require('../../app')
const request = require("supertest");

beforeAll((done) => {
    server = app.listen(done);
});

afterAll((done) => {
    server.close(done);
});

describe('Test List Book || GET Test API /api/books', () => {
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
    },30000)
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
    },30000)
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
    },30000)
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
    },30000)
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
    },30000)
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
    },30000)
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
    },30000)
})