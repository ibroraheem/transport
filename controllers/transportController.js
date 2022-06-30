const Transport = require('../models/transport')
const StatusCode = require('http-status-codes')
const QRCode = require('qrcode')
const nodemailer = require('nodemailer')
require('dotenv').config()

const createBooking = async (req, res) => {
    const { name, email, phone, address, occupation, vehicle, from, to, date, time, next_of_kin_name, next_of_kin_phone, next_of_kin_email, next_of_kin_address, next_of_kin_relationship } = req.body
    try {
        const booking = await Transport.create({
            name,
            email,
            phone,
            address,
            occupation,
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
        })
        const qr = await QRCode.toDataURL(`Name: ${booking.name}\n Email: ${booking.email}\n Phone: ${booking.phone}\n Address: ${booking.address}\n Occupation: ${booking.occupation}\n Vehicle: ${booking.vehicle}\n From: ${booking.from}\n To: ${booking.to}\n Date: ${booking.date}\n Time: ${booking.time}\n Next of Kin Name: ${booking.next_of_kin_name}\n Next of Kin Phone: ${booking.next_of_kin_phone}\n Next of Kin Email: ${booking.next_of_kin_email}\n Next of Kin Address: ${booking.next_of_kin_address}`, { type: 'image/png' })
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: "Nodemailer Contact",
            to: booking.email,
            subject: 'Booking Confirmation',
            text: `Hello ${booking.name},\n\n Thank you for booking with us. Your booking has been confirmed.\n\n Your booking details are as follows:\n\n Name: ${booking.name}\n Email: ${booking.email}\n Phone: ${booking.phone}\n Address: ${booking.address}\n Occupation: ${booking.occupation}\n Vehicle: ${booking.vehicle}\n From: ${booking.from}\n To: ${booking.to}\n Date: ${booking.date}\n Time: ${booking.time}\n Next of Kin Name: ${booking.next_of_kin_name}\n Next of Kin Phone: ${booking.next_of_kin_phone}\n Next of Kin Email: ${booking.next_of_kin_email}\n Next of Kin Address: ${booking.next_of_kin_address}\n\n Please scan the QR code below to confirm your booking.\n\n ${qr}`
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(info)
            }
        })

        res.status(StatusCode.CREATED).json({ message: "Booking created successfully", qr })
    } catch (error) {
        console.log(error)
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" })

    }
}

    const getBookings = async (req, res) => {
        try {
            const bookings = await Transport.find()
            res.status(StatusCode.OK).send(bookings)
        }
        catch (err) {
            res.status(StatusCode.BAD_REQUEST).send(err)
        }
    }
    const getBooking = async (req, res) => {
        const { id } = req.params
        try {
            const booking = await Transport.findById(id)
            res.status(StatusCode.OK).send(booking)
        }
        catch (err) {
            res.status(StatusCode.BAD_REQUEST).send(err)
        }
    }
    const updateBooking = async (req, res) => {
        const { id } = req.params
        const { name, email, phone, address, occupation, vehicle, from, to, date, time, next_of_kin_name, next_of_kin_phone, next_of_kin_email, next_of_kin_address } = req.body
        try {
            const booking = await Transport.findByIdAndUpdate(id, {
                name,
                email,
                phone,
                address,
                occupation,
                vehicle,
                from,
                to,
                date,
                time,
                next_of_kin_name,
                next_of_kin_phone,
                next_of_kin_email,
                next_of_kin_address
            }, { new: true })
            res.status(StatusCode.OK).send(booking)
        }
        catch (err) {
            res.status(StatusCode.BAD_REQUEST).send(err)
        }
    }
    const deleteBooking = async (req, res) => {
        const { id } = req.params
        try {
            await Transport.findByIdAndDelete(id)
            res.status(StatusCode.OK).send('Booking deleted')
        }
        catch (err) {
            res.status(StatusCode.BAD_REQUEST).send(err)
        }
    }

    module.exports = { createBooking, deleteBooking, getBookings, getBooking, updateBooking }