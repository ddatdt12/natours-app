const express = require('express');

const router = express.Router();
const { isLoggedIn, protect } = require('../middlewares/auth');

const viewsController = require('../controllers/viewsController');

// router.user(isLoggedIn)
//protect have pretty same functionality with isLoggedIn so don't use both that make a bit better for performance

router.get('/', isLoggedIn, viewsController.getOverview);
router.get('/login', isLoggedIn, viewsController.getLoginForm);
router.get('/signup', isLoggedIn, viewsController.getSignUpForm);
router.get('/tours/:slug', isLoggedIn, viewsController.getTourDetails);
router.get('/me', protect, viewsController.getMe);
module.exports = router;
