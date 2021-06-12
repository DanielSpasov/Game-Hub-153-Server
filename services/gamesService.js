const errorHandler = require('../middlewares/errorHandler')


const Game = require('../Models/Game')



const create = (data) => {
    const gameInfo = new Game({ ...data })
    return gameInfo
        .save()
        .catch(errorHandler)
}

const getAll = () => {
    const games = Game.find({})
    return games
}



module.exports = {
    create,
    getAll,
}