const errorHandler = (err, req, res, next) => {

    if (err.code === 11000) return res.status(400).json({ msg: 'Game with this name already exists' })

    return res.status(400).json({ msg: err._message })
}

module.exports = errorHandler