const express = require('express');
const {getListUser} = require('../controllers/userController');
const apiRouter = express.Router();

apiRouter.get("/api/users", getListUser)

module.exports = apiRouter