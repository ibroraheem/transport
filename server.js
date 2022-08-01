const express = require('express')
const app = express()
const connectDB = require('./config/db')
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const StatusCode = require('http-status-codes')
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
connectDB()

app.get('/', (req, res) => {
    res.status(StatusCode.OK).send('Hello World')
})
app.use('/', require('./routes/ticketRoutes'))
app.use("/admin", require('./routes/authRoutes'))


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})