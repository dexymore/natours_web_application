const express = require('express');

const authController=require('../controllers/authController');

const usersRouter = express.Router();
const {
  getAllusers,
  createuser,
  getuser,
  updateuser,
  delteuser,
} = require('../controllers/usersController');


usersRouter.post('/signup',authController.signup)
usersRouter.post('/login',authController.login)
usersRouter.post('/forgetpassword',authController.forgetpassword)
usersRouter.patch('/resetpassword/:token',authController.resetPassword)
usersRouter.patch('/updatemypassword',authController.protect,authController.updatePassword)
usersRouter.route('/').get(getAllusers).post(createuser);

usersRouter.route('/:id').get(getuser).patch(updateuser).delete(delteuser); 
module.exports = usersRouter;
