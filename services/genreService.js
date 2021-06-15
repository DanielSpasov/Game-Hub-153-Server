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
            .populate('games')
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

        if (reqGenre.usersUpvoted.includes(req.body.userID)) throw new Error('You have already upvoted this genre.')

        reqGenre.upvotes += 1
        reqGenre.usersUpvoted.push(req.body.userID)

        const genre = Genre.findByIdAndUpdate(req.body.data._id, reqGenre)
        return genre

    } catch (err) { errorHandler(err, req, res) }
}



module.exports = {
    create,
    getAll,
    getOne,
    editOne,
    upvote,
}