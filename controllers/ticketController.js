const Ticket = require('../models/ticket')
const qrCode = require('qrcode')

const createTicket = async (req, res) => {
    const {name, email, phone, address, vehicle, from, to, date, time, next_of_kin_name, next_of_kin_phone, next_of_kin_email, next_of_kin_address, next_of_kin_relationship} = req.body
    const ticket = new Ticket({
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
    })
    try {
        const newTicket = await ticket.save()
        qrCode.toDataURL(newTicket._id, (err, url) => {
            if (err) {
                throw err
            }
            newTicket.qr_code = url
            newTicket.save()
        }
        )
        res.status(201).json({
            message: 'Ticket created successfully',
            ticket: newTicket
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
const getTickets = (req, res) => {
    Ticket.find({})
        .then(tickets => {
            res.status(200).json({
                tickets
            })
        }
        )
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        }
        )
}
const getTicket = (req, res) => {
    const {id} = req.params
    Ticket.findById(id)
        .then(ticket => {
            res.status(200).json({
                ticket
            })
        }) .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
}
const updateTicket = async (req, res) => {
    const {id} = req.params
    const {name, email, phone, address, vehicle, from, to, date, time, next_of_kin_name, next_of_kin_phone, next_of_kin_email, next_of_kin_address, next_of_kin_relationship} = req.body
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
        }, {new: true})
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
module.exports = {createTicket, getTickets, getTicket, updateTicket}





















































 