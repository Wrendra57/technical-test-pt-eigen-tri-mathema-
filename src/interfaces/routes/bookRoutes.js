const express = require('express');
const {getListBooks} = require('../controllers/bookController');
const apiRouter = express.Router();

apiRouter.get("/api/books", getListBooks)

module.exports = apiRouter