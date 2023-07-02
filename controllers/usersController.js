const catchAsync = require('../utils/catchAsync');
// eslint-disable-next-line import/extensions
const AppError = require('../utils/appError');

const User = require('../models/userModal');

const filteredObj = function (obj, ...objkeys) {
  const filteredobject = {};
  Object.keys(obj).forEach((el) => {
    if (objkeys.includes(el)) filteredobject[el] = obj[el];
  });
  return filteredobject;
};

exports.updateme = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for password update please use update my password',
        400
      )
    );
  }
  const filteredBody = filteredObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteme = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
  next()
});

exports.getAllusers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,

    data: { users },
  });
});
exports.createuser = (req, res) => {
  res.status(500).json({ statusbar: 'error', message: 'not implemented yet' });
};
exports.getuser = (req, res) => {
  res.status(500).json({ statusbar: 'error', message: 'not implemented yet' });
};

exports.updateuser = (req, res) => {
  res.status(500).json({ statusbar: 'error', message: 'not implemented yet' });
};

exports.delteuser = (req, res) => {
  res.status(500).json({ statusbar: 'error', message: 'not implemented yet' });
};
