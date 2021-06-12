const router = require('express').Router()

const gamesService = require('../services/gamesService')



router.post('/add', async (req, res) => {
    let promise = await gamesService.create(req.body)
    res.json(promise)
})

router.get('/getAll', async (req, res) => {
    let promise = await gamesService.getAll()
    res.json(promise)
})



module.exports = router