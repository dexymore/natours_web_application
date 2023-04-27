

const catchAsync= require('../utils/catchAsync')
// eslint-disable-next-line import/extensions


const User = require('../models/userModal');

exports.getAllusers = catchAsync(async (req, res) => {


  const users = await User.find()

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
