const express = require('express')

const viewRouter = express.Router();

const authController=require('../controllers/authController')

const viewsController=require('../controllers/viewsController');


viewRouter.get('/',authController.isLoggedIn,viewsController.getOverview) 

viewRouter.get('/tour/:slug',authController.isLoggedIn, viewsController.getTour )

viewRouter.get('/login',authController.isLoggedIn,viewsController.getLoginForm)

viewRouter.get('/me',authController.protect,viewsController.getAccount)

viewRouter.get('/signup',viewsController.getSignupForm)

module.exports = viewRouter;