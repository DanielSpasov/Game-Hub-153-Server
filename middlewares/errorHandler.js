const errorHandler = (err, req, res) => {

    let type = req.baseUrl.slice(1, req.baseUrl.length - 1)
    type = type.replace(type[0], type[0].toUpperCase())

    let outputError
    if (err.code === 11000) {
        if (err.keyValue.hasOwnProperty('username')) outputError = res.status(400).json({ msg: `User with this username already exists` })
        if (err.keyValue.hasOwnProperty('title')) outputError = res.status(400).json({ msg: `${type} with this title already exists` })
    } else {
        outputError = res.status(400).json({ msg: err._message })
    }

    return outputError
}

module.exports = errorHandler