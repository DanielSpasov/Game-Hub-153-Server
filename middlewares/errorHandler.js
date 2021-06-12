const errorHandler = (err, req, res, next) => {

    let outputMessage = `Error: ${err.message}`

    return outputMessage
}

module.exports = errorHandler