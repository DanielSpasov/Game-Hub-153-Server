const router = require('express').Router()

router.get('/', (req, res) => {
    res.json({ 'home': 'page' })
})

router.get('/test', (req, res) => {
    res.json({ 'test': 'successful' })
})

module.exports = router