const StatusCode = require('http-status-codes')
const QRCode = require('qrcode')
const nodemailer = require('nodemailer')

const createBooking = async (req, res) => {
    const {name, email, phone, address, occupation, vehicle, from, to, date, time, next_of_kin_name, next_of_kin_phone, next_of_kin_email, next_of_kin_address} = req.body
    const transport = new Transport({
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
    })
    try {
        await transport.save()
        res.status(StatusCode.CREATED).send(transport)
        QRCode.toDataURL(`Name: ${transport.name}, ${transport.from}, ${transport.to}, ${transport.date}, ${transport.vehicle}`, (err, url) => {
            if (err) {
                console.log(err)
            }
            else {
                transport.qr_code = url
                transport.save()
            }
        })
        const transporter = nodemailer.createTransport({
            
            ost: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: transport.email,
            subject: 'Vehicle Booking',
            text: `Dear ${transport.name},\n\nYou have successfully booked a vehicle.\n\nVehicle: ${transport.vehicle}\nFrom: ${transport.from}\nTo: ${transport.to}\nDate: ${transport.date}\nTime: ${transport.time}\n\nNext of Kin: ${transport.next_of_kin_name}\nPhone: ${transport.next_of_kin}Phone\nEmail: ${transport.next_of_kin_email}\nAddress: ${transport.next_of_kin_address}\n\nRegards,\n\n${process.env.NAME}`
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(info)
            }
        })
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).send(err)
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
    const {id} = req.params
    try {
        const booking = await Transport.findById(id)
        res.status(StatusCode.OK).send(booking)
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).send(err)
    }
}
const updateBooking = async (req, res) => {
    const {id} = req.params
    const {name, email, phone, address, occupation, vehicle, from, to, date, time, next_of_kin_name, next_of_kin_phone, next_of_kin_email, next_of_kin_address} = req.body
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
        }, {new: true})
        res.status(StatusCode.OK).send(booking)
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).send(err)
    }
}
const deleteBooking = async (req, res) => {
    const {id} = req.params
    try {
        await Transport.findByIdAndDelete(id)
        res.status(StatusCode.OK).send('Booking deleted')
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).send(err)
    }
}

module.exports = {createBooking, deleteBooking, getBookings, getBooking, updateBooking}