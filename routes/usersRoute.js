const express = require('express');

const multer = require('multer');

const authController=require('../controllers/authController');

const upload = multer({ dest: 'public/img/users' });

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
  uploadUserPhoto,
  resizePhoto

} = require('../controllers/usersController');

usersRouter.post('/signup',authController.signup)
usersRouter.post('/login',authController.login)
usersRouter.get('/logout',authController.logout)
usersRouter.post('/forgetpassword',authController.forgetpassword)
usersRouter.patch('/resetpassword/:token',authController.resetPassword)
usersRouter.use(authController.protect)
usersRouter.patch('/updatemypassword',authController.updatePassword)
usersRouter.patch('/updateme',uploadUserPhoto,resizePhoto,updateme)
usersRouter.get('/getme',getme,getuser)
usersRouter.delete('/deleteme',deleteme)
usersRouter.use(authController.restrict('admin'))
usersRouter.route('/:id').get(getuser).patch(updateuser).delete(delteuser); 
usersRouter.route('/').get(getAllusers).post(createuser)

module.exports = usersRouter;
