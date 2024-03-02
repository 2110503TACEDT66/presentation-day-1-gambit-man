const express = require('express');
const router = express.Router();
const { protect, authorization } = require('../middleware/auth');

const {
  getProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
} = require('../controllers/providers');

const bookingRouter = require('./bookings');

//re-route into other resource routers
//providers want to see the car of him that was booked
router.use('/:providerId/bookings/', bookingRouter);

router
  .route('/')
  .get(getProviders)
  .post(protect, authorization('admin'), createProvider);
router
  .route('/:id')
  .get(getProvider)
  .put(protect, authorization('admin'), updateProvider)
  .delete(protect, authorization('admin'), deleteProvider);

module.exports = router;
