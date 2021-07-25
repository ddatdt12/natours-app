const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

//@desc         Get all tours
//@route        GET /
//@access       Public
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

//@desc         Get single tour
//@route        GET /tours/:slug
//@access       Public
exports.getTourDetails = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'user review rating'
  });
  if (!tour) {
    return next(new AppError('No tour found with that name !', 404));
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log in your account'
  });
};

exports.getSignUpForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Register account'
  });
};

exports.getMe = (req, res, next) => {
  res.status(200).render('me', {
    title: 'My Account'
  });
};

exports.getResetEmail = (req, res, next) => {
  res.status(200).render('reset', {
    title: 'Reset Password'
  });
};

exports.getResetPassword = (req, res, next) => {
  res.status(200).render('resetpassword', {
    title: 'Reset Password',
    token: req.params.token
  });
};

exports.getMyTour = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id }).populate({
    path: 'tour',
    select: '-images -guides -description'
  });

  const tours = bookings.map(booking => {
    const tour = { ...booking.tour.toObject(), bookedAt: booking.createdAt };
    return tour;
  });
  res.status(200).render('overview', {
    title: 'My tours',
    tours,
    isPersonal: true
  });
});
