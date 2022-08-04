const Ticket = require('../models/ticket')
const qrCode = require('qrcode')
const nodemailer = require('nodemailer')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createTicket = async (req, res) => {
    const { name, email, phone, address, vehicle, from, to, date, time, next_of_kin_name, next_of_kin_phone, next_of_kin_email, next_of_kin_address, next_of_kin_relationship } = req.body
    await Ticket.create({ name: name, email: email, phone: phone, address: address, vehicle: vehicle, from: from, to: to, date: date, time: time, next_of_kin_name: next_of_kin_name, next_of_kin_phone: next_of_kin_phone, next_of_kin_email: next_of_kin_email, next_of_kin_address: next_of_kin_address, next_of_kin_relationship: next_of_kin_relationship })
        .then(() => {
            qrCode.toDataURL(
                `${Ticket.id}`, (err, url) => {
                    if (err) {
                        res.status(500).json({
                            message: "Error in generating QR Code",
                            error: err
                        })
                    } else {
                        
                        const Name = process.env.NAME
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.zoho.eu',
                            port: 465,
                            auth: {
                                user: process.env.MAIL,
                                pass: process.env.PASS
                            }
                        })
                        const mailOptions = {
                            from: process.env.MAIL,
                            to: email,
                            subject: 'Ticket Confirmation',
                            text: `Hello ${name},\n\nYour ticket has been created successfully.\n\n${url} \n \n Have a safe Journey! \n ${Name}`
                        }
                        transporter.sendMail(mailOptions, (err) => {
                            if (err) {
                                res.status(500).json({
                                    message: "Error in sending email",
                                    error: err
                                })
                            } else {
                                res.status(200).json({
                                    message: "Email sent successfully"
                                })
                            }
                        })

                    }
                    // res.status(200).json({
                    //     message: "Ticket created successfully",
                    //     url: url
                    // })
                }
            )
        })

}

const getTickets = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const email = decoded.email
    const user = User.findByEmail(email)
    if (!user) {
        res.status(404).json({
            message: 'User not found'
        })
    } else {
        const tickets = await Ticket.find()
        res.status(200).json({
            tickets
        })
    }


}
const getTicket = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const email = decoded.email
    const user = User.findByEmail(email)
    if (!user) {
        res.status(404).json({
            message: 'User not found'
        })
    } else {
        try {
            const { id } = req.params
            Ticket.findById(id)
                .then(ticket => {
                    res.status(200).json({
                        ticket
                    })
                }).catch(err => {
                    res.status(500).json({
                        message: err.message
                    })
                })
        }
        catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }
}
const updateTicket = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const email = decoded.email
    const user = User.findByEmail(email)
    if (!user) {
        res.status(404).json({
            message: 'User not found'
        })
    } else {
        const { id } = req.params
        const { name, email, phone, address, vehicle, from, to, date, time, next_of_kin_name, next_of_kin_phone, next_of_kin_email, next_of_kin_address, next_of_kin_relationship } = req.body
        try {
            const ticket = await Ticket.findByIdAndUpdate(id, {
                name,
                email,
                phone,
                address,
                vehicle,
                from,
                to,
                date,
                time,
                next_of_kin_name,
                next_of_kin_phone,
                next_of_kin_email,
                next_of_kin_address,
                next_of_kin_relationship
            }, { new: true })
            res.status(200).json({
                message: 'Ticket updated successfully',
                ticket
            })
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }
}
const deleteTicket = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const email = decoded.email
    const user = User.findByEmail(email)
    if (!user) {
        res.status(404).json({
            message: 'User not found'
        })
    }
    else {
        const { id } = req.params
        try {
            const ticket = await Ticket.findByIdAndDelete(id)
            res.status(200).json({
                message: 'Ticket deleted successfully',
                ticket
            })
        } catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }
}
module.exports = { createTicket, getTickets, getTicket, updateTicket, deleteTicket }