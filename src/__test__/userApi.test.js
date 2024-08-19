const app = require('../app')
const request = require("supertest");
const {
    sequelize,
    Sequelize,
} = require("../infrastructure/database/models");
const models = require('../infrastructure/database/models')
const User = models.User
beforeAll((done) => {

    server = app.listen(done);
});

afterAll((done) => {

    server.close(done);
});

describe('Test List User || GET Test API /api/users', () => {
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });
    it ('should return 200 OK and list user', async () => {
        jest.clearAllMocks();
        const limit = 10
        const page = 1
        const url = `/api/users?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)

            })
    })
    it ('should return 200 OK and list user with undefined limit', async () => {

        const page = 1
        const url = `/api/users?page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)

            })
    })
    it ('should return 200 OK and list user with empty limit', async () => {
        const limit = ""
        const page = 1
        const url = `/api/users?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)

            })
    })
    it ('should return 400 Error with invalid limit', async () => {
        const limit = "1a"
        const page = "1"
        const url = `/api/users?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)

            })
    })
    it ('should return 200 OK and list user with undefined offset', async () => {
        const limit = "10"

        const url = `/api/users?limit=${limit}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.message).toEqual("Success Retrieve Data Users")
                expect(res.body.status).toEqual("Success")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })
    it ('should return 200 OK and list user with empty offset', async () => {
        const limit = "10"
        const page = ""
        const url = `/api/users?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.message).toEqual("Success Retrieve Data Users")
                expect(res.body.status).toEqual("Success")
                expect(res.body.request_id).not.toBe(undefined)

            })
    })
    it ('should return 400 Error with invalid offset', async () => {
        const limit = "10"
        const page = "1a"
        const url = `/api/users?limit=${limit}&page=${page}`

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
    it ('should return 500 Internal Server Error', async () => {
        const mockQuery = jest.spyOn(sequelize, 'query').mockRejectedValue(new Error(`Database error`));
        const mockCount = jest.spyOn(User, 'count').mockResolvedValue(0);

        const limit = "10"
        const page = "1"
        const url = `/api/users?limit=${limit}&page=${page}`

        return request(server)
            .get(url)
            .then((res)=>{
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.status).toEqual("Error")
                expect(res.body.request_id).not.toBe(undefined)

            })
            .finally(() => {
                mockQuery.mockRestore();  // Restore mocking setelah selesai
                mockCount.mockRestore();
            });
    })
})

describe('Test Create User || POST /api/users', ()=>{
    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it ('should return 200 OK create user and return data user', async () => {
        const url = `/api/users`

        return request(server)
            .post(url)
            .send({name: 'john'})
            .then((res)=>{
                expect(res.status).toBe(200);
                expect(res.body.data).not.toEqual(null)
                expect(res.body.status).toEqual("Success")
                expect(res.body.message).toEqual("Success Create Data Users")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })

    it ('should return 400 Error Validation Name is Required', async () => {
        const url = `/api/users`

        return request(server)
            .post(url)
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Name is required")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })
    it ('should return 400 Error Validation Name must be at least 3 characters', async () => {
        const url = `/api/users`

        return request(server)
            .post(url)
            .send({name:"na"})
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Name must be at least 3 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })

    it ('should return 400 Error Validation Name must be maximum 255 characters', async () => {

        const url = `/api/users`

        return request(server)
            .post(url)
            .send({name:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.\n"})
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Name must be maximum 255 characters")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })

    it ('should return 400 Error Validation Name must be only alphabet', async () => {
        const url = `/api/users`

        return request(server)
            .post(url)
            .send({name:"sdwdaf3"})
            .then((res)=>{
                expect(res.status).toBe(400);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Name must be only alphabet")
                expect(res.body.request_id).not.toBe(undefined)
            })
    })

    it ('should return 500 Error Internal Server Error', async () => {
        const mockCreate = jest.spyOn(User, 'create').mockRejectedValue(new Error("Database Error"));
        const url = `/api/users`

        return request(server)
            .post(url)
            .send({name:"sdwdaf"})
            .then((res)=>{
                expect(res.status).toBe(500);
                expect(res.body.data).toEqual(null)
                expect(res.body.status).toEqual("Error")
                expect(res.body.message).toEqual("Internal Server Error")
                expect(res.body.request_id).not.toBe(undefined)
            }).finally(() => {
                mockCreate.mockRestore();

            });
    })
})