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

router.get('/topFive', async (req, res) => {
    let response = await genreService.getTopFive(req, res)
    res.json(response)
})

router.post('/delete/:id', async (req, res) => {
    let response = await genreService.deleteGenre(req, res)
    res.json(response)
})

router.post('/comment/:id', async (req, res) => {
    let response = await genreService.comment(req, res)
    res.json(response)
})

router.post('/authorizeEditor/:id', async (req, res) => {
    let response = await genreService.authorizeEditor(req, res)
    res.json(response)
})

router.post('/removeEditor/:id', async (req, res) => {
    let response = await genreService.removeEditor(req, res)
    res.json(response)
})



module.exports = router