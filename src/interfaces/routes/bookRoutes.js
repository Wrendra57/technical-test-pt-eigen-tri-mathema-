const express = require('express');
const {getListBooks, createBook} = require('../controllers/bookController');
const {validation} = require("../middleware/validations");
const {createBookValidation} = require("../middleware/validations/bookValidations");
const apiRouter = express.Router();

apiRouter.get("/api/books", getListBooks)
apiRouter.post("/api/books",validation(createBookValidation), createBook)
module.exports = apiRouter