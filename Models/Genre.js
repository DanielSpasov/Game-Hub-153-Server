const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
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
    gamesInGenre: [{
        type: mongoose.Types.ObjectId,
        ref: 'Game',
    }],
    upvotes: {
        type: Number,
        default: 0,
    },
    usersUpvoted: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    comments: {
        type: Array,
        default: [],
    },
    creator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    authrorizedEditors: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }]
})

module.exports = mongoose.model('Genre', genreSchema)