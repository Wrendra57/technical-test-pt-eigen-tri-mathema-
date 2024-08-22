module.exports = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Borrow Book API",
            version: "1.0.0",
            description: "Borrow Book Documentation"
        },
        externalDocs: {
            description: "Find out more",
            url: "https://swagger.io"
        },
        servers: [
            {
                url: "http://localhost:8081",
                description: "Local server"
            }
        ]
    },
    apis:['./**/*.yaml'],
}    