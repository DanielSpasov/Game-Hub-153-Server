const router = require('express').Router()

const homeController = require('./controllers/homeController')

const userController = require('./controllers/userController')

const gamesController = require('./controllers/gamesController')
const genreController = require('./controllers/genreController')



router.use('/', homeController)

router.use('/user', userController)

router.use('/games', gamesController)
router.use('/genres', genreController)

router.get('*', (req, res) => {
    res.json({ message: 'Page not found' })
})

module.exports = router