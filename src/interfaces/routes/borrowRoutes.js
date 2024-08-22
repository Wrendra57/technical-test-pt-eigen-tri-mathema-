const express = require('express');
const {createBorrows, returnBorrows} = require('../controllers/borrowController');
const {validation} = require("../middleware/validations");
const {createBorrowValidation, returnBorrowValidation} = require("../middleware/validations/borrowValidations");
const apiRouter = express.Router();

// apiRouter.get("/api/books", getListBooks)
apiRouter.post("/api/borrows",validation(createBorrowValidation), createBorrows)
apiRouter.post("/api/borrows/return",validation(returnBorrowValidation), returnBorrows)
module.exports = apiRouter