const router = require('express').Router()

const devService = require('../services/devService')



router.post('/add', async (req, res) => {
    let response = await devService.create(req, res)
    res.json(response)
})

router.get('/getAll', async (req, res) => {
    let response = await devService.getAll(req, res)
    res.json(response)
})

router.get('/getOne/:id', async (req, res) => {
    let response = await devService.getOne(req, res)
    res.json(response)
})

router.post('/editOne/:id', async (req, res) => {
    let response = await devService.editOne(req, res)
    res.json(response)
})

router.post('/upvote/:id', async (req, res) => {
    let response = await devService.upvote(req, res)
    res.json(response)
})

router.get('/topFive', async (req, res) => {
    let response = await devService.getTopFive(req, res)
    res.json(response)
})

router.get('/delete/:id', async (req, res) => {
    let response = await devService.deleteDev(req, res)
    res.json(response)
})

router.post('/comment/:id', async (req, res) => {
    let response = await devService.comment(req, res)
    res.json(response)
})



module.exports = router