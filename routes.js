const router = require('express').Router()

const homeController = require('./controllers/homeController')

const userController = require('./controllers/userController')

const gameController = require('./controllers/gameController')
const genreController = require('./controllers/genreController')
const devController = require('./controllers/devController')



router.use('/', homeController)

router.use('/user', userController)

router.use('/games', gameController)
router.use('/devs', devController)
router.use('/genres', genreController)

router.get('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' })
})

module.exports = router