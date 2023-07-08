const express = require('express');

const authController=require('../controllers/authController');

const usersRouter = express.Router();
const {  
  getme,
  getAllusers,
  createuser,
  getuser,
  updateuser,
  delteuser,
  updateme,
  deleteme,

} = require('../controllers/usersController');

usersRouter.post('/signup',authController.signup)
usersRouter.post('/login',authController.login)
usersRouter.post('/forgetpassword',authController.forgetpassword)
usersRouter.patch('/resetpassword/:token',authController.resetPassword)
usersRouter.use(authController.protect)
usersRouter.patch('/updatemypassword',authController.protect,authController.updatePassword)
usersRouter.patch('/updateme',authController.protect,updateme)
usersRouter.get('/getme',authController.protect,getme,getuser)
usersRouter.delete('/deleteme',authController.protect,deleteme)
usersRouter.use(authController.restrict('admin'))
usersRouter.route('/:id').get(getuser).patch(updateuser).delete(delteuser); 
usersRouter.route('/').get(getAllusers).post(createuser)

module.exports = usersRouter;
