const router = require('express').Router()

const auth = require('../middlewares/auth')

const userService = require('../services/userService')

const User = require('../Models/User')



router.post('/register', (req, res) => userService.register(req, res))
router.post('/login', (req, res) => userService.login(req, res))
router.post('/tokenIsValid', (req, res) => userService.tokenIsValid(req, res))
router.get('/getOne/:username', (req, res) => userService.getOne(req, res))

router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user)
    res.json({ username: user.username, id: user._id, email: user.email })
})



module.exports = router