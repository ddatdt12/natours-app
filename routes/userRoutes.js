const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const { getMe } = require('./../controllers/userController');

const { protect, restrictTo } = require('./../middlewares/auth');

const router = express.Router();

//Guest
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Current User
router.use(protect);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  authController.uploadUserPhoto,
  authController.resizeUserPhoto,
  authController.updateMe
);
router.delete('/deleteMe', authController.deleteMe);
router.get('/me', getMe);

//Admin route
router.use(restrictTo('admin'));
router.route('/').get(userController.getAllUsers);

//Don't creat user = admin
// .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
