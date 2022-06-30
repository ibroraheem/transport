const express = require('express')
const router = express.Router()
const {createBooking, getBooking, getBookings, deleteBooking, updateBooking} = require('../controllers/transportController')

router.post('/book', createBooking)
router.get('/bookings', getBookings)
router.get('/booking/:id', getBooking)
router.delete('/booking/:id', deleteBooking)
router.patch('/booking/:id', updateBooking)

module.exports = router
