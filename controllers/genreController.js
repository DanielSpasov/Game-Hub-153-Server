const router = require('express').Router()

const genreService = require('../services/genreService')



router.post('/add', async (req, res) => {
    let response = await genreService.create(req, res)
    res.json(response)
})

router.get('/getAll', async (req, res) => {
    let response = await genreService.getAll(req, res)
    res.json(response)
})

router.get('/getOne/:id', async (req, res) => {
    let response = await genreService.getOne(req, res)
    res.json(response)
})

router.post('/editOne/:id', async (req, res) => {
    let response = await genreService.editOne(req, res)
    res.json(response)
})

router.post('/upvote/:id', async (req, res) => {
    let response = await genreService.upvote(req, res)
    res.json(response)
})




module.exports = router