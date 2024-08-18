require('dotenv').config();

const express = require('express');
const bodyParser= require('body-parser')
const cors = require("cors")
const port = process.env.PORT || 8081;
const requestIdMiddleware = require('./interfaces/middleware/requestId')
const userRoutes = require("./interfaces/routes/userRoutes")
const requestLoggerMiddleware = require('./interfaces/middleware/requestLogger')
const app = express()

app.use(cors(false))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(requestIdMiddleware)
app.use(requestLoggerMiddleware)
app.use(userRoutes)
app.get('/', (req, res) => {return res.status(200).json({ request_id:req.requestId,status: "success", message: "server already", data:null })})
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})
module.exports = app
