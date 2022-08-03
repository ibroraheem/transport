const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    vehicle: {
        type: String,
        required: true,
        enum: ['car', 'bus']
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }, 
    time: {
        type: String,
        enum: ['morning', 'afternoon'],
        required: true
    },
    next_of_kin_name:{
        type: String,
        required: true
    },
    next_of_kin_phone: {
        type: String,
        required: true
    },
    next_of_kin_email: {
        type: String,
        required: true
    },
    next_of_kin_address: {
        type: String,
        required: true
    },
    next_of_kin_relationship: {
        type: String,
        required: true
    }
})

const Ticket = new mongoose.model('Ticket', TicketSchema)
module.exports= Ticket