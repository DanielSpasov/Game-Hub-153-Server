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
            // .populate('games')
        return dev
    } catch (err) { errorHandler(err, req, res) }
}



module.exports = {
    create,
    getAll,
    getOne,
}