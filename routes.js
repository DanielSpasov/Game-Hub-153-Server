const router = require('express').Router()

const homeController = require('./controllers/homeController')
const gamesController = require('./controllers/gamesController')
const userController = require('./controllers/userController')

router.use('/', homeController)
router.use('/games', gamesController)
router.use('/user', userController)

router.get('*', (req, res) => {
    res.json({ message: 'Page not found' })
})

module.exports = router