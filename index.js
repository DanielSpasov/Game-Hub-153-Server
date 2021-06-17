require('dotenv').config()

const express = require('express')

const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const PORT = process.env.PORT

const app = express()

require('./config/mongoose')
require('./config/express')(app)

app.use(routes)
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${PORT}...`))