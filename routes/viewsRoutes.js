const express = require('express');

const router = express.Router();
const { isLoggedIn, protect, havePermission } = require('../middlewares/auth');
const { haveAlerts } = require('../middlewares/alerts');

const viewsController = require('../controllers/viewsController');

// router.user(isLoggedIn)
//protect have pretty same functionality with isLoggedIn so don't use both that make a bit better for performance
router.use(haveAlerts);

router.get('/', isLoggedIn, viewsController.getOverview);
router.get('/login', isLoggedIn, viewsController.getLoginForm);
router.get('/signup', isLoggedIn, viewsController.getSignUpForm);
router.get('/tours/:slug', isLoggedIn, viewsController.getTourDetails);
router.get('/my-tours', isLoggedIn, havePermission, viewsController.getMyTour);
router.get('/me', protect, havePermission, viewsController.getMe);
module.exports = router;
