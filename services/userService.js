const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../Models/User')



const login = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) return res.status(400).json({ msg: 'Not all fields have been entered.' })

        const user = await User.findOne({ email: email })
        if (!user) return res.status(400).json({ msg: 'No account with this email has been registered.' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) res.status(400).json({ msg: 'Invalid credentials.' })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ token, user: { id: user._id, username: user.username } })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const register = async (req, res) => {
    try {

        let { email, password, rePassword, username } = req.body

        if (!email || !password) return res.status(400).json({ msg: 'Not all fields have been entered.' })
        if (password.length < 6) return res.status(400).json({ msg: 'The password needs to be at least 6 symbols.' })
        if (password !== rePassword) return res.status(400).json({ msg: 'The passwords doesn\'t match.' })

        const existingUser = await User.findOne({ email: email })
        if (existingUser) return res.status(400).json({ msg: 'A user with this email is already registered.' })

        if (!username) username = email.split('@')[0]

        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({ email, password: passwordHash, username })
        const savedUser = await newUser.save()

        res.json(savedUser)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const tokenIsValid = async (req, res) => {
    try {

        const token = req.header('x-auth-token')
        if (!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false)

        return res.json(true)

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getOne = async (req, res) => {
    try {
        let userData = await User
            .findOne({ username: req.params.username })
            .populate('upvotedGames')
            .populate('upvotedGenres')
            .populate('upvotedDevs')
    
        userData.password = ''
        return res.json(userData)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


module.exports = {
    login,
    register,
    tokenIsValid,
    getOne,
}