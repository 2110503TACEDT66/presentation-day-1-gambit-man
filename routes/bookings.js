const express = require('express');
const {getBookings, getBooking, addBooking, updateBooking, deleteBooking} = require('../controllers/appointments');

const router = express.Router({mergeParams:true});
const {protect,authorization} = require('../middleware/auth');

router.route('/').get(protect, getBookings).post(protect,authorization('admin','user'),addBooking);
router.route('/:id').get(protect, getBooking).put(protect,authorization('admin','user'),updateBooking).delete(protect,authorization('admin','user'),deleteBooking);


module.exports=router;