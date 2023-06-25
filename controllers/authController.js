const { promisify } = require('util');

const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const User = require("../models/userModal");

const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

const sendEmail = require('../utils/email');



const expirationdate =
  Math.floor(Date.now() / 1000) + parseInt(process.env.JWT_EXPIRES_IN, 10);

const signToken = function (id) {
  return jwt.sign(
    {
      id,

      exp: expirationdate,
    },
    process.env.JWT_SECRET
  );
};

exports.signup = catchAsync(async (req, res, next) => {
  // Code snippet 1: Explicitly defining object properties

  const newUser = await User.create({
    // Define properties with corresponding req.body properties here i choose what properties would i pass when creating  new user
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordchangedat: req.body.passwordchangedat,
    role: req.body.role,
  });
  // Code snippet 2: Passing entire req.body object
  //const newUser = await User.create(req.body);
  // Here, all properties in the req.body object will be passed to the User.create() method without specifing what to pass.

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  /// check if emaail and password exist
  if (!email || !password) {
    return next(new AppError('please enter email and password', 400));
  }

  ///check if user exist and password is correct

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('incorrect email or password', 401));

  /// if everything is okay send the token
  const token = signToken(user._id);

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const issuedAt = new Date(decoded.iat * 1000); // Convert Unix timestamp to milliseconds
  const expirationTime = new Date(decoded.exp * 1000); // Convert Unix timestamp to milliseconds

  console.log('Token was issued at:', issuedAt.toISOString());
  console.log('Token will expire at:', expirationTime.toISOString());
  res.status(200).json({
    status: 'success',
    token,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1)assigning token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('you are not logged in to ', 401));
  }

  //2 verifcation
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const issuedAt = new Date(decoded.iat * 1000); // Convert Unix timestamp to milliseconds
  const expirationTime = new Date(decoded.exp * 1000); // Convert Unix timestamp to milliseconds

  console.log('Token was issued at:', issuedAt.toISOString());
  console.log('Token will expire at:', expirationTime.toISOString());
  //3) checek if user still exists
  const freshUser = await User.findById(decoded.id);
  console.log(freshUser);
  if (freshUser === null) {
    return next(new AppError('this user is not exist anymore ', 404));
  }
  //4CHECK IF PASSWORD CHANGED
  if (freshUser.changedAasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // access granted
  req.user = freshUser;
  next();
});
// Define a function called "restrict" that accepts any number of roles as arguments.
exports.restrict = function (...roles) {
  // Return a middleware function that accepts the "req", "res", and "next" parameters.
  return (req, res, next) => {
    // Check if the "roles" array includes the "role" property of the "req.user" object.
    if (!roles.includes(req.user.role)) {
      // If not, call the "next" function with a new "AppError" object that has a message and a status code of 403.
      return next(
        new AppError("You don't have permission to do this action", 403)
      );
    }

    // If the "roles" array does include the "role" property of the "req.user" object, call the "next" function.
    next();
  };
};
exports.forgetpassword = catchAsync(async (req, res, next) => {
  //1) get user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('there is no such a user', 404));
  }
  //2)generate random password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) send user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetpassword/${resetToken}`;

  const message = `forgot your password?submit a new password with a patch request to :${resetURL}.\n if not please agnore this meassage  `;
  try {
    await sendEmail({
      email: req.body.email,
      subject: 'reset password token (valid for 10 mins only)',
      message:message,
    });
    res.status(200).json({ status: 'success', meassage: 'token sent to mail' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('there was an error sending the email try again latter ')
    ); 
  }
});

//////////////////////////////////////////////////////////////


exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
const token = signToken(user._id);
  res.status(200).json({status:'success',token:token});
});