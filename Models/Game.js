const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true,
        maxLength: 25,
        unique: true,
    },
    description: {
        type: String,
        minLnegth: 10,
        required: true,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    usersUpvoted: {
        type: Array,
        default: [],
    },
    comments: {
        type: Array,
        default: [],
    }
})

module.exports = mongoose.model('Game', gameSchema)