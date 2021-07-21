const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');
const { protect, restrictTo } = require('./../middlewares/auth');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  protect,
  bookingController.getCheckoutSession
);
module.exports = router;
