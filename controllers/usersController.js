const catchAsync = require('../utils/catchAsync');
// eslint-disable-next-line import/extensions
const AppError = require('../utils/appError');

const User = require('../models/userModal');

const factory=require('./handlerFactory')

const filteredObj = function (obj, ...objkeys) {
  const filteredobject = {};
  Object.keys(obj).forEach((el) => {
    if (objkeys.includes(el)) filteredobject[el] = obj[el];
  });
  return filteredobject;
};
exports.getme=(req,res,next)=>{
  req.params.id=req.user.id
next()
}

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



exports.createuser = (req, res) => {
  res.status(500).json({ statusbar: 'error', message: 'this route is not defined and please use sign up instead' });
};
exports.getAllusers = factory.getAlldocs(User)
exports.getuser = factory.getOne(User)
// this is not used to update passowrds
exports.updateuser = factory.updateOne(User )

exports.delteuser=factory.deleteOne(User)