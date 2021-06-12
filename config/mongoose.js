const mongoose = require('mongoose')
const { DB_URI } = require('./index')

const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.connect(DB_URI, dbOptions)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', () => console.log('Database connected'))

module.exports = db