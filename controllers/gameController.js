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

router.post('/editOne/:id', async (req, res) => {
    let response = await gameService.editOne(req, res)
    res.json(response)
})

router.post('/upvote/:id', async (req, res) => {
    let response = await gameService.upvote(req, res)
    res.json(response)
})

router.get('/topFive', async (req, res) => {
    let response = await gameService.getTopFive(req, res)
    res.json(response)
})

router.post('/delete/:id', async (req, res) => {
    let response = await gameService.deleteGame(req, res)
    res.json(response)
})

router.post('/comment/:id', async (req, res) => {
    let response = await gameService.comment(req, res)
    res.json(response)
})

router.post('/authorizeEditor/:id', async (req, res) => {
    let response = await gameService.authorizeEditor(req, res)
    res.json(response)
})




module.exports = router