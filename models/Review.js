const mongoose = require('mongoose');

const Review = mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review can not be empty!'] },
    rating: {
      type: Number,
      min: [1, 'The rating must be above 0'],
      max: [5, 'The rating must be below 5']
    },
    createdAt: { type: Date, default: Date.now() },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

Review.pre(/^find/, function(next) {
  // populate({
  //   path: 'tour',
  //   select: 'name'
  // })

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

Review.index({ tour: 1, user: 1 }, { unique: true });

Review.statics.calcRatingsAverage = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        ratingsQuantity: { $sum: 1 },
        ratingsAverage: { $avg: '$rating' }
      }
    }
  ]);
  const ratingsQuantity = stats[0].ratingsQuantity || 0;
  const ratingsAverage = stats[0].ratingsAverage || 4.5;

  try {
    await this.model('Tour').findByIdAndUpdate(tourId, {
      ratingsQuantity,
      ratingsAverage
    });
  } catch (error) {
    console.log(error);
  }
};

Review.post('save', function() {
  this.constructor.calcRatingsAverage(this.tour);
});

Review.pre(/^findOneAnd/, async function(next) {
  //Save updated or deleted Review into query, in order to post(/^findOneAnd/) call calcRatingsAverage()
  this.review = await this.findOne();
  next();
});

Review.post(/^findOneAnd/, async function() {
  //this.review get from (pre) query middleware
  this.model.calcRatingsAverage(this.review.tour);
});
module.exports = mongoose.model('Review', Review);
