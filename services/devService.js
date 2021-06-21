const errorHandler = require('../middlewares/errorHandler')


const User = require('../Models/User')
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

        let user = await User
            .findById(req.body.userID)

        let dev = await Dev
            .findById(req.params.id)
            .populate('gamesByDev')

        // REMOVE UPVOTE
        if (dev.usersUpvoted.includes(req.body.userID)) {
            dev.upvotes -= 1
            let userIdIndex = dev.usersUpvoted.indexOf(req.body.userID)
            dev.usersUpvoted.splice(userIdIndex, 1)

            let devIdIndex = user.upvotedDevs.indexOf(req.params.id)
            user.upvotedDevs.splice(devIdIndex, 1)
            await user.save()

        // UPVOTE
        } else {
            dev.upvotes += 1
            dev.usersUpvoted.push(req.body.userID)
            
            user.upvotedDevs.push(dev._id)
            await user.save()
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

const authorizeEditor = async (req, res) => {
    try {

        const dev = await Dev.findById(req.params.id)
        if (req.body.userID != dev.creator) throw ({ _message: 'You don\'t have permission to authorize editors' })

        const editorAccount = await User.findOne({ email: req.body.editorEmail })
        if (!editorAccount) throw ({ _message: 'User with this email doesn\'t exist' })

        if (editorAccount._id == req.body.userID) throw ({ _message: 'You cannot add yourself to the editors' })

        if (dev.authorizedEditors.includes(editorAccount._id)) throw ({ _message: 'This user is already editor' })

        dev.authorizedEditors.push(editorAccount._id)
        return await dev.save()

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
    authorizeEditor,
}