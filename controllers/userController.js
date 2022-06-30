const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const StatusCode = require('http-status-codes')
require('dotenv').config()

const register = async (req, res) => {
    const {email, name, password} = req.body
    const user = new User({
        email,
        name,
        password
    })
    try {
        await user.save()
        res.status(StatusCode.CREATED).send(user)
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).send(err)
    }
}

const login = (req, res) => {
    const {email, password} = req.body
    User.findOne({email}, (err, user) => {
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
                    const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn: '1h'})
                    res.status(StatusCode.OK).send({token})
                }
            })
        }
    })
}

module.exports = {register, login}