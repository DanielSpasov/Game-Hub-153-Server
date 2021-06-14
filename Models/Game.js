const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: true,
        maxLength: 25,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        minLnegth: 10,
        required: true,
    },
    moreInfo: {
        type: String,
        minLnegth: 10,
    },
    videoUrl: {
        type: String,
    },
    genre: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Genre',
    },
    dev: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Dev',
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
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    authrorizedEditors: {
        type: Array,
        default: [],
    }
})

module.exports = mongoose.model('Game', gameSchema)