const express = require('express')
const router = express.Router()
const {createTicket, getTickets, getTicket, updateTicket, deleteTicket} = require('../controllers/ticketController')

router.post('/create', createTicket)
router.get('/tickets', getTickets)
router.get('/ticket/:id', getTicket)
router.delete('/ticket/:id', deleteTicket)
router.patch('/ticket/:id', updateTicket)

module.exports = router