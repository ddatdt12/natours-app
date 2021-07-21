const Review = require('../models/Review');
const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./factoryHandler');

//@desc         Get all review
//@route        GET /api/v1/reviews

//@desc         Get all review on particular Tour
//@route        GET /api/v1/tours/:tourId/reviews
//@access       Public
exports.getAllReview = factory.getAll(Review);

//@desc         Get single review
//@route        GET /api/v1/tours/reviews/:id
//@route        GET /api/v1/tours/:tourId/reviews/:id
//@access       Public
exports.getReview = factory.getOne(Review);

//@desc         Create review
//@route        POST /api/v1/tours/:tourId/reviews
//@access       Private
exports.createReview = catchAsync(async (req, res, next) => {
  if (req.params.tourId) req.body.tour = req.params.tourId;

  const review = await Review.create({ user: req.user._id, ...req.body });

  res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
});
//@desc         Update review
//@route        PATCH /api/v1/reviews/:id
//@route        PATCH /api/v1/tours/:tourId/reviews/:id
//@access       Private
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: { review }
  });
});

//@desc         Delete review
//@route        DELETE /api/v1/reviews/:id
//@route        DELETE /api/v1/tours/:tourId/reviews/:id
//@access       Private
exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});
