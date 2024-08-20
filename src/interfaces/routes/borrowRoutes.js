const express = require('express');
const {createBorrows} = require('../controllers/borrowController');
const {validation} = require("../middleware/validations");
const {createBorrowValidation} = require("../middleware/validations/borrowValidations");
const apiRouter = express.Router();

// apiRouter.get("/api/books", getListBooks)
apiRouter.post("/api/borrows",validation(createBorrowValidation), createBorrows)
module.exports = apiRouter