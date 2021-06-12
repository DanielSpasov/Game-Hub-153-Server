const errorHandler = (err, req, res, next) => {

    let message = err.message || 'Something went wrong!'
    let pathname = req.path.slice(1, req.path.length)
    let status = err.status || 500

    console.log(err)

    res.render(pathname, { error: { message } })
}

module.exports = errorHandler