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
        let devs
        if (!req.query.search) devs = await Dev.find({})
        if (req.query.search) devs = await Dev.aggregate([{ $search: { text: { query: req.query.search, path: 'title' } } }])
        return devs
    } catch (err) { errorHandler(err, req, res) }
}

const getOne = async (req, res) => {
    try {
        const dev = await Dev
            .findById(req.params.id)
            .populate('gamesByDev')
            .populate('authorizedEditors', 'email')
            .populate('comments.author', 'username')
        return dev
    } catch (err) { errorHandler(err, req, res) }
}

const editOne = async (req, res) => {
    try {
        await Dev.findByIdAndUpdate(req.params.id, req.body.data)
        return await getOne(req, res)
    } catch (err) { errorHandler(err, req, res) }
}

const upvote = async (req, res) => {
    try {

        let user = await User
            .findById(req.body.userID)

        let dev = await getOne(req, res)

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
        reqDev.comments.push({ author: req.body.userID, content: req.body.content })
        await Dev.findByIdAndUpdate(req.params.id, reqDev)
        return await getOne(req, res)
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
        await dev.save()

        return await getOne(req, res)

    } catch (err) { errorHandler(err, req, res) }
}

const removeEditor = async (req, res) => {
    try {

        let dev = await Dev.findById(req.params.id)
        if (dev.creator != req.body.userID) throw ({ _message: 'You don\'t have permission to remove editors' })

        if (!dev.authorizedEditors.includes(req.body.editorID)) throw ({ _message: 'The selected user is not an editor' })

        let startIndex = dev.authorizedEditors.indexOf(req.body.editorID)
        dev.authorizedEditors.splice(startIndex, 1)
        await dev.save()

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
    deleteDev,
    comment,
    authorizeEditor,
    removeEditor,
}