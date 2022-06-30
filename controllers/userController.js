const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const StatusCode = require('http-status-codes')
require('dotenv').config()

const register = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(StatusCode.BAD_REQUEST).json({ message: "Email already Exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save()
        res.status(StatusCode.CREATED).json({ message: "User created successfully" })
    } catch (error) {
        console.log(error)
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: "Error Creating user"
        })
    }

}

const login = (req, res) => {
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
        if (err) {
            res.status(StatusCode.BAD_REQUEST).send(err)
        }
        else if (!user) {
            res.status(StatusCode.NOT_FOUND).send('User not found')
        }
        else {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    res.status(StatusCode.BAD_REQUEST).send(err)
                }
                else if (!isMatch) {
                    res.status(StatusCode.UNAUTHORIZED).send('Incorrect password')
                }
                else {
                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }
                    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
                    res.status(StatusCode.OK).send({ token })
                }
            })
        }
    })
}

module.exports = { register, login }