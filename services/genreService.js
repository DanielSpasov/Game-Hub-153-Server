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



module.exports = {
    create,
    getAll,
    getOne,
    editOne,
}