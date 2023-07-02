const express = require('express');

const authController=require('../controllers/authController');

const usersRouter = express.Router();
const {
  getAllusers,
  createuser,
  getuser,
  updateuser,
  delteuser,
  updateme,
  deleteme
} = require('../controllers/usersController');


usersRouter.post('/signup',authController.signup)
usersRouter.post('/login',authController.login)
usersRouter.post('/forgetpassword',authController.forgetpassword)
usersRouter.patch('/resetpassword/:token',authController.resetPassword)
usersRouter.patch('/updatemypassword',authController.protect,authController.updatePassword)
usersRouter.patch('/updateme',authController.protect,updateme)
usersRouter.route('/').get(getAllusers).post(createuser);
usersRouter.delete('/deleteme',authController.protect,deleteme)
usersRouter.route('/:id').get(getuser).patch(updateuser).delete(delteuser); 
module.exports = usersRouter;
