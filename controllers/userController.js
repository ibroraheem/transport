const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const register = async (req, res) => {
    const {name, email, password} = req.body
    hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
        name,
        email,
        password: hashedPassword
    })
    try {
        const newUser = await user.save()
        res.status(201).json({
            message: 'User created successfully',
            user: newUser.name
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
    const payload = {
        user: {
            id: user._id,
        }
    }
    jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
}

const login = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }
        const payload = {
            user: {
                id: user._id,
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                throw err
            }
            res.status(200).json({
                token
            })
        }
        )
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = { register, login }