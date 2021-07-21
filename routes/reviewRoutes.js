const express = require('express');
const {
  getAllReview,
  getReview,
  createReview,
  deleteReview,
  updateReview
} = require('./../controllers/reviewController');

const {
  protect,
  restrictTo,
  isAuthorizedToAct
} = require('./../middlewares/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReview)
  .post(protect, restrictTo('user'), createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(protect, isAuthorizedToAct, updateReview)
  .delete(protect, isAuthorizedToAct, deleteReview);

module.exports = router;
