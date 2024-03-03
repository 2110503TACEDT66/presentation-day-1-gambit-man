const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

exports.getBookings = async (req, res, next) => {
  try {
    let query;

    if (req.user.role !== 'admin') {
      query = Booking.find({ user: req.user.id }).populate({
        path: 'provider',
        select: 'name address tel',
      });
    } else {
      if (req.params.providerId) {
        query = Booking.find({ provider: req.params.providerId }).populate({
          path: 'provider',
          select: 'name address tel',
        });
      } else {
        query = Booking.find().populate({
          path: 'provider',
          select: 'name address tel',
        });
      }
    }

    const bookings = await query;

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Cannot find booking',
    });
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'provider',
      select: 'name address tel',
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Cannot find booking',
    });
  }
};

exports.addBooking = async (req, res, next) => {
  try {
    req.body.provider = req.params.providerId;

    const provider = await Provider.findById(req.params.providerId);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `No provider with the id of ${req.params.providerId}`,
      });
    }

    req.body.user = req.user.id;

    const existedBooking = await Booking.find({
      user: req.user.id,
    });

    if (existedBooking.length >= 3 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `he user with ID ${req.user.id} has already made 3 bookings`,
      });
    }

    const booking = await Booking.create(req.body);

    res.status(200).json({
      success: true,
      data: booking,
    });
    console.log(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Cannot add booking',
    });
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Cannot update booking',
    });
    
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(401).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Cannot delete booking',
    });
  }
};
