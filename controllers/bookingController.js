const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

//@desc         Get checkout session
//@route        GET /api/v1/bookings/
//@access       Public
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    success_url: `${req.protocol}://${req.get(
      'host'
    )}/my-tours?alert='booking'`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    payment_method_types: ['card'],
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          unit_amount: tour.price * 100,
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`
            ]
          }
        },
        quantity: 1
      }
    ],
    mode: 'payment'
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});
exports.createBooking = catchAsync(async (req, res, next) => {
  const { tourId, email } = req.body;
  if (!email || !tourId) {
    return next(new AppError(`Invalid input!`, 400));
  }
  const user = await User.findOne({ email });
  const tour = await Tour.findById(tourId);
  if (!user) return next(new AppError(`Email doesn't exist!`, 404));
  const booking = await Booking.create({
    user,
    tour,
    paid: true,
    price: tour.price
  });
  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

const createCheckoutBooking = async session => {
  const tourId = session.client_reference_id;
  const userId = await User.findOne({ email: session.customer_email })._id;
  const price = session.amount_total / 100; //Because Currency of  amount in line items is cent
  await Booking.create({ tour: tourId, user: userId, price, paid: true });
};
//@desc         Booking was created when payment is successful
//@route        POST /api/v1/tours/webhook-checkout
//@access       POST
exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  console.log(signature);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_ENDPOINT_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // console.log(event);
  // Handle the event
  if (event.type === 'checkout.session.completed')
    await createCheckoutBooking(event.data.object); //event.data.object pretty like session when we checkout

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
