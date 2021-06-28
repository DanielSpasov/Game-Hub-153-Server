const errorHandler = require('../middlewares/errorHandler')

const User = require('../Models/User')
const Game = require('../Models/Game')
const Genre = require('../Models/Genre')
const Dev = require('../Models/Dev')



const create = async (req, res) => {
    try {
        const gameInfo = new Game({ ...req.body.data, creator: req.body.userID })

        let gameGenre = await Genre.findById(req.body.data.genre)
        gameGenre.gamesInGenre.push(gameInfo._id)
        gameGenre.save()

        let gameDev = await Dev.findById(req.body.data.dev)
        gameDev.gamesByDev.push(gameInfo._id)
        gameDev.save()

        gameInfo.save()

        return true
    } catch (err) { errorHandler(err, req, res) }
}

const getAll = async (req, res) => {
    try {
        let games
        if (!req.query.search) games = await Game.find({})
        if (req.query.search) games = await Game.aggregate([{ $search: { text: { query: req.query.search, path: 'title' } } }])
        return games
    } catch (err) { errorHandler(err, req, res) }
}

const getOne = async (req, res) => {
    try {
        const game = Game
            .findById(req.params.id)
            .populate('genre')
            .populate('dev')
            .populate('authorizedEditors', 'email')
        return game
    } catch (err) { errorHandler(err, req, res) }
}

const editOne = async (req, res) => {
    try {

        let oldGame = await Game.findById(req.params.id)
        let newGame = req.body.data

        if (oldGame.genre != newGame.genre) {
            // REMOVE THE GAME FROM THE OLD GENRE
            let oldGenre = await Genre.findById(oldGame.genre)
            let oldIndex = oldGenre.gamesInGenre.indexOf(req.params.id)
            oldGenre.gamesInGenre.splice(oldIndex, 1)
            oldGenre.save()

            // ADD THE GAME TO THE NEW GENRE
            let newGenre = await Genre.findById(newGame.genre)
            newGenre.gamesInGenre.push(req.params.id)
            newGenre.save()
        }
        if (oldGame.dev != newGame.dev) {
            // REMOVE THE GAME FROM THE OLD DEV
            let oldDev = await Dev.findById(oldGame.dev)
            let oldIndex = oldDev.gamesByDev.indexOf(req.params.id)
            oldDev.gamesByDev.splice(oldIndex, 1)
            oldDev.save()

            // ADD THE GAME TO THE NEW DEV
            let newDev = await Dev.findById(newGame.dev)
            newDev.gamesByDev.push(req.params.id)
            newDev.save()
        }

        await Game.findByIdAndUpdate(req.params.id, req.body.data)
        return await getOne(req, res)
    } catch (err) { errorHandler(err, req, res) }
}

const upvote = async (req, res) => {
    try {

        let user = await User
            .findById(req.body.userID)

        let game = await getOne(req, res)

        // REMOVE UPVOTE
        if (game.usersUpvoted.includes(req.body.userID)) {
            game.upvotes -= 1
            let userIdIndex = game.usersUpvoted.indexOf(req.body.userID)
            game.usersUpvoted.splice(userIdIndex, 1)

            let gameIdIndex = user.upvotedGames.indexOf(req.params.id)
            user.upvotedGames.splice(gameIdIndex, 1)
            await user.save()

            // UPVOTE
        } else {
            game.upvotes += 1
            game.usersUpvoted.push(req.body.userID)

            user.upvotedGames.push(game._id)
            await user.save()
        }

        return await game.save()

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
        await Game.findByIdAndUpdate(req.params.id, reqGame)
        return await getOne(req, res)
    } catch (err) { errorHandler(err, req, res) }
}

const authorizeEditor = async (req, res) => {
    try {

        const game = await Game.findById(req.params.id)
        if (req.body.userID != game.creator) throw ({ _message: 'You don\'t have permission to authorize editors' })

        const editorAccount = await User.findOne({ email: req.body.editorEmail })
        if (!editorAccount) throw ({ _message: 'User with this email doesn\'t exist' })

        if (editorAccount._id == req.body.userID) throw ({ _message: 'You cannot add yourself to the editors' })

        if (game.authorizedEditors.includes(editorAccount._id)) throw ({ _message: 'This user is already editor' })

        game.authorizedEditors.push(editorAccount._id)
        await game.save()

        return await getOne(req, res)

    } catch (err) { errorHandler(err, req, res) }
}

const removeEditor = async (req, res) => {
    try {

        let game = await Game.findById(req.params.id)
        if (game.creator != req.body.userID) throw ({ _message: 'You don\'t have permission to remove editors' })

        if (!game.authorizedEditors.includes(req.body.editorID)) throw ({ _message: 'The selected user is not an editor' })

        let startIndex = game.authorizedEditors.indexOf(req.body.editorID)
        game.authorizedEditors.splice(startIndex, 1)
        await game.save()

        return await getOne(req, res)

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
    authorizeEditor,
    removeEditor,
}