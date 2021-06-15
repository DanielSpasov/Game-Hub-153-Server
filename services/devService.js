const errorHandler = require('../middlewares/errorHandler')


const Dev = require('../Models/Dev')



const create = async (req, res) => {
    try {
        const devInfo = new Dev({ ...req.body.data, creator: req.body.userID })
        return await devInfo.save()
    } catch (err) { errorHandler(err, req, res) }
}

const getAll = async (req, res) => {
    try {
        const devs = Dev.find({})
        return devs
    } catch (err) { errorHandler(err, req, res) }
}

const getOne = async (req, res) => {
    try {
        const dev = Dev.findById(req.params.id)
        return dev
    } catch (err) { errorHandler(err, req, res) }
}

const editOne = async (req, res) => {
    try {
        const dev = Dev.findByIdAndUpdate(req.params.id, req.body.data)
        return dev
    } catch (err) { errorHandler(err, req, res) }
}

const upvote = async (req, res) => {
    try {

        let reqDev = req.body.data

        if (reqDev.usersUpvoted.includes(req.body.userID)) throw new Error('You have already upvoted this developer.')

        reqDev.upvotes += 1
        reqDev.usersUpvoted.push(req.body.userID)

        const dev = Dev.findByIdAndUpdate(req.body.data._id, reqDev)
        return dev

    } catch (err) { errorHandler(err, req, res) }
}



module.exports = {
    create,
    getAll,
    getOne,
    editOne,
    upvote,
}