const express = require('express');
const apiRouter = express.Router();

apiRouter.get("/api/users", (req, res) => {return res.status(200).json({ status: "OK", message: "user Already" })})

module.exports = apiRouter