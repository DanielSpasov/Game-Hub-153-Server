const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    username: {
        type: String,
    },
    roles: {
        type: Array,
        default: ['user']
    },
    upvotedGames: [{
        type: mongoose.Types.ObjectId,
        ref: 'Game',
    }],
    upvotedGenres: [{
        type: mongoose.Types.ObjectId,
        ref: 'Genre',
    }],
    upvotedDevs: [{
        type: mongoose.Types.ObjectId,
        ref: 'Dev',
    }],
})

module.exports = mongoose.model('User', userSchema)