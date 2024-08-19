const express = require('express');
const {getListUser, createUser} = require('../controllers/userController');
const {validation} = require("../middleware/validations");
const {createUserValidation} = require("../middleware/validations/userValidation");
const apiRouter = express.Router();

apiRouter.get("/api/users", getListUser)
apiRouter.post("/api/users", validation(createUserValidation),createUser)

module.exports = apiRouter