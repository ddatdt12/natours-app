const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const factory = require('./factoryHandler');

//@desc         Get all Users
//@route        GET /api/v1/users
//@access       PRIVATE (ADMIN)
exports.getAllUsers = factory.getAll(User);

//@desc         Create User
//@route        POST /api/v1/users/:id
//@access       PRIVATE (ADMIN)
exports.createUser = factory.createOne(User);

//@desc         Get  single User
//@route        GET /api/v1/users/:id
//@access       PRIVATE (ADMIN)
exports.getUser = factory.getOne(User);

//@desc         Update User
//@route        POST /api/v1/users/:id
//@access       PRIVATE (ADMIN)
// DOn't update password because of password not hashed
exports.updateUser = factory.updateOne(User);

//@desc         Delete Password
//@route        DELETE /api/v1/users/:id
//@access       PRIVATE (ADMIN)
exports.deleteUser = factory.deleteOne(User);

//@desc         Get infor of current user
//@route        POST /api/v1/users/me
//@access       PRIVATE
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
