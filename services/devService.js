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

        if (reqDev.usersUpvoted.includes(req.body.userID)) {
            let startIndex = reqDev.usersUpvoted.indexOf(req.body.userID)
            reqDev.usersUpvoted.splice(startIndex, 1)
            reqDev.upvotes -= 1
        } else {
            reqDev.upvotes += 1
            reqDev.usersUpvoted.push(req.body.userID)
        }

        const dev = Dev.findByIdAndUpdate(req.body.data._id, reqDev)
        return dev

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
        let deletedDev = await Dev.findByIdAndDelete(req.params.id)
        return deletedDev
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