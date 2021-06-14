const errorHandler = (err, req, res, next) => {

    let type = req.baseUrl.slice(1, req.baseUrl.length - 1)
    type = type.replace(type[0], type[0].toUpperCase())

    if (err.code === 11000) return res.status(400).json({ msg: `${type} with this title already exists` })

    return res.status(400).json({ msg: err._message })
}

module.exports = errorHandler