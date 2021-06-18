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
        const dev = Dev
            .findById(req.params.id)
            .populate('gamesByDev')
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

        let dev = await Dev
            .findById(req.params.id)
            .populate('gamesByDev')

        // REMOVE UPVOTE
        if (dev.usersUpvoted.includes(req.body.userID)) {
            dev.upvotes -= 1
            let userIdIndex = dev.usersUpvoted.indexOf(req.body.userID)
            dev.usersUpvoted.splice(userIdIndex, 1)

        // UPVOTE
        } else {
            dev.upvotes += 1
            dev.usersUpvoted.push(req.body.userID)
        }

        return await dev.save()

    } catch (err) { errorHandler(err, req, res) }
}

const getTopFive = async (req, res) => {
    try {
        let devs = await Dev.find({})
        devs = devs.sort((a, b) => b.upvotes - a.upvotes).slice(0, 5)
        return devs
    } catch (err) { errorHandler(err, req, res) }
}

const deleteDev = async (req, res) => {
    try {
        let dev = await Dev.findById(req.params.id)
        if (req.body.userID != dev.creator) return false
        let deletedDev = await Dev.findByIdAndDelete(req.params.id)
        if (deletedDev) return true
    } catch (err) { errorHandler(err, req, res) }
}

const comment = async (req, res) => {
    try {
        let reqDev = await Dev.findById(req.params.id)
        reqDev.comments.push({ author: req.body.username, content: req.body.content })
        const dev = await Dev.findByIdAndUpdate(req.params.id, reqDev)
        return dev
    } catch (err) { errorHandler(err, req, res) }
}



module.exports = {
    create,
    getAll,
    getOne,
    editOne,
    upvote,
    getTopFive,
    deleteDev,
    comment,
}