const router = require('express').Router()

const gameService = require('../services/gameService')



router.post('/add', async (req, res) => {
    let response = await gameService.create(req, res)
    res.json(response)
})

router.get('/getAll', async (req, res) => {
    let response = await gameService.getAll(req, res)
    res.json(response)
})

router.get('/getOne/:id', async (req, res) => {
    let response = await gameService.getOne(req, res)
    res.json(response)
})




module.exports = router