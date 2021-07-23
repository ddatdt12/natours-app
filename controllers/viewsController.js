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

exports.getMyTour = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const bookings = await Booking.find({ user: req.user._id });
  console.log(bookings);

  const tourIds = bookings.map(booking => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render('my-tour', {
    title: 'My tours'
  });
});
