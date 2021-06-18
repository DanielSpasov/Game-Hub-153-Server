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

        if (reqGame.usersUpvoted.includes(req.body.userID)) {
            let startIndex = reqGame.usersUpvoted.indexOf(req.body.userID)
            reqGame.usersUpvoted.splice(startIndex, 1)
            reqGame.upvotes -= 1
        } else {
            reqGame.upvotes += 1
            reqGame.usersUpvoted.push(req.body.userID)
        }

        const game = Game
            .findByIdAndUpdate(req.body.data._id, reqGame)
            .populate('genre')
            .populate('dev')
        return game

    } catch (err) { errorHandler(err, req, res) }
}

const getTopFive = async (req, res) => {
    try {
        let games = await Game.find({})
        games = games.sort((a, b) => b.upvotes - a.upvotes).slice(0, 5)
        return games
    } catch (err) { errorHandler(err, req, res) }
}

const deleteGame = async (req, res) => {
    try {
        let game = await Game.findById(req.params.id)
        if (req.body.userID != game.creator) return false
        let deletedGame = await Game.findByIdAndDelete(req.params.id)
        if (deletedGame) return true
    } catch (err) { errorHandler(err, req, res) }
}

const comment = async (req, res) => {
    try {
        let reqGame = await Game.findById(req.params.id)
        reqGame.comments.push({ author: req.body.username, content: req.body.content })
        const game = await Game.findByIdAndUpdate(req.params.id, reqGame)
        return game
    } catch (err) { errorHandler(err, req, res) }
}



module.exports = {
    create,
    getAll,
    getOne,
    editOne,
    upvote,
    getTopFive,
    deleteGame,
    comment,
}