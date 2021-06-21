const errorHandler = require('../middlewares/errorHandler')


const User = require('../Models/User')
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

        let user = await User
            .findById(req.body.userID)

        let genre = await Genre
            .findById(req.params.id)
            .populate('gamesInGenre')

        // REMOVE UPVOTE
        if (genre.usersUpvoted.includes(req.body.userID)) {
            genre.upvotes -= 1
            let userIdIndex = genre.usersUpvoted.indexOf(req.body.userID)
            genre.usersUpvoted.splice(userIdIndex, 1)

            let genreIdIndex = user.upvotedGenres.indexOf(req.params.id)
            user.upvotedGenres.splice(genreIdIndex, 1)
            await user.save()

            // UPVOTE
        } else {
            genre.upvotes += 1
            genre.usersUpvoted.push(req.body.userID)

            user.upvotedGenres.push(genre._id)
            await user.save()
        }

        return await genre.save()

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

const authorizeEditor = async (req, res) => {
    try {

        const genre = await Genre.findById(req.params.id)
        if (req.body.userID != genre.creator) throw ({ _message: 'You don\'t have permission to authorize editors' })

        const editorAccount = await User.findOne({ email: req.body.editorEmail })
        if (!editorAccount) throw ({ _message: 'User with this email doesn\'t exist' })

        if (editorAccount._id == req.body.userID) throw ({ _message: 'You cannot add yourself to the editors' })

        if (genre.authorizedEditors.includes(editorAccount._id)) throw ({ _message: 'This user is already editor' })

        genre.authorizedEditors.push(editorAccount._id)
        return await genre.save()

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
    authorizeEditor,
}