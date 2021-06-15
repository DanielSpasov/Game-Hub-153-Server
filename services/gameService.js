const errorHandler = require('../middlewares/errorHandler')


const Game = require('../Models/Game')



const create = async (req, res) => {
    try {
        const gameInfo = new Game({ ...req.body.data, creator: req.body.userID })
        return await gameInfo.save()
    } catch (err) { errorHandler(err, req, res) }
}

const getAll = async (req, res) => {
    try {
        const games = Game.find({})
        return games
    } catch (err) { errorHandler(err, req, res) }
}

const getOne = async (req, res) => {
    try {
        const game = Game
            .findById(req.params.id)
            .populate('genre')
            .populate('dev')
        return game
    } catch (err) { errorHandler(err, req, res) }
}

const editOne = async (req, res) => {
    try {
        const game = Game.findByIdAndUpdate(req.params.id, req.body.data)
        return game
    } catch (err) { errorHandler(err, req, res) }
}

const upvote = async (req, res) => {
    try {

        let reqGame = req.body.data

        if (reqGame.usersUpvoted.includes(req.body.userID)) throw new Error('You have already upvoted this game.')

        reqGame.upvotes += 1
        reqGame.usersUpvoted.push(req.body.userID)

        const game = Game.findByIdAndUpdate(req.body.data._id, reqGame)
        return game

    } catch (err) { errorHandler(err, req, res) }
}



module.exports = {
    create,
    getAll,
    getOne,
    editOne,
    upvote,
}