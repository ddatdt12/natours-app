const mongoose = require('mongoose');

const BookingModel = mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user']
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    paid: { type: Boolean, default: false }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

BookingModel.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name '
  });
});

module.exports = mongoose.model('Booking', BookingModel);
