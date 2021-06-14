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



module.exports = {
    create,
    getAll,
}