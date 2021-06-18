const errorHandler = require('../middlewares/errorHandler')


const Genre = require('../Models/Genre')



const create = async (req, res) => {
    try {
        const genreInfo = new Genre({ ...req.body.data, creator: req.body.userID })
        return await genreInfo.save()
    } catch (err) { errorHandler(err, req, res) }
}

const getAll = async (req, res) => {
    try {
        const genres = Genre.find({})
        return genres
    } catch (err) { errorHandler(err, req, res) }
}

const getOne = async (req, res) => {
    try {
        const genre = Genre
            .findById(req.params.id)
            .populate('gamesInGenre')
        return genre
    } catch (err) { errorHandler(err, req, res) }
}

const editOne = async (req, res) => {
    try {
        const genre = Genre.findByIdAndUpdate(req.params.id, req.body.data)
        return genre
    } catch (err) { errorHandler(err, req, res) }
}

const upvote = async (req, res) => {
    try {

        let reqGenre = req.body.data

        if (reqGenre.usersUpvoted.includes(req.body.userID)) {
            let startIndex = reqGenre.usersUpvoted.indexOf(req.body.userID)
            reqGenre.usersUpvoted.splice(startIndex, 1)
            reqGenre.upvotes -= 1
        } else {
            reqGenre.upvotes += 1
            reqGenre.usersUpvoted.push(req.body.userID)
        }

        const genre = Genre.findByIdAndUpdate(req.body.data._id, reqGenre)
        return genre

    } catch (err) { errorHandler(err, req, res) }
}

const getTopFive = async (req, res) => {
    try {
        let genres = await Genre.find({})
        genres = genres.sort((a, b) => b.upvotes - a.upvotes).slice(0, 5)
        return genres
    } catch (err) { errorHandler(err, req, res) }
}

const deleteGenre = async (req, res) => {
    try {
        let genre = await Genre.findById(req.params.id)
        if (req.body.userID != genre.creator) return false
        let deletedGenre = await Genre.findByIdAndDelete(req.params.id)
        if (deletedGenre) return true
    } catch (err) { errorHandler(err, req, res) }
}

const comment = async (req, res) => {
    try {
        let reqGenre = await Genre.findById(req.params.id)
        reqGenre.comments.push({ author: req.body.username, content: req.body.content })
        const genre = await Genre.findByIdAndUpdate(req.params.id, reqGenre)
        return genre
    } catch (err) { errorHandler(err, req, res) }
}



module.exports = {
    create,
    getAll,
    getOne,
    editOne,
    upvote,
    getTopFive,
    deleteGenre,
    comment,
}