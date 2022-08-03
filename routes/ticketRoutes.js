const express = require('express')
const router = express.Router()
const {createTicket, getTickets, getTicket, updateTicket, deleteTicket} = require('../controllers/ticketController')

router.post('/create', createTicket)
router.get('/', getTickets)
router.get('/:id', getTicket)
router.delete('/:id', deleteTicket)
router.patch('/:id', updateTicket)

module.exports = router