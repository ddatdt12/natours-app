const express = require('express');
const tourController = require('./../controllers/tourController');
const { protect, restrictTo } = require('./../middlewares/auth');
const { aliasTopTour } = require('../middlewares/support');
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();
// Rerouter route related to review into Review Router
router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourController.getStats);
router.route('/top-5-cheap-best').get(aliasTopTour, tourController.getAllTours);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide'), tourController.getMonthPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    protect,
    restrictTo('admin', 'lead-guide', 'guides'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    protect,
    restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
