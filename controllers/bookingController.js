const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/Tour');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

//@desc         Get checkout session
//@route        GET /api/v1/bookings/
//@access       Public
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    payment_method_types: ['card'],
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        amount: tour.price * 100,
        images: [
          `https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=667&q=80`
        ],
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

const createBooking = async session => {
  const tourId = session.client_reference_id;
  const userId = await User.findOne({ email: session.customer_email })._id;
  const price = session.display_items[0].amount / 100; //Because Currency of  amount in line items is cent
  await Tour.create({ tour: tourId, user: userId, price });
};
//@desc         Booking was created when payment is successful
//@route        POST /api/v1/tours/webhook-checkout
//@access       POST
exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];

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

  // Handle the event
  if (event.type === 'checkout.session.completed')
    await createBooking(event.data.object); //event.data.object pretty like session when we checkout

  // Return a response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};
