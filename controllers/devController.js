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




module.exports = router