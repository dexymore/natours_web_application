const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModal');
const AppError = require('../utils/appError');
const User = require('../models/userModal');

exports.getOverview = catchAsync(async(req, res, next) => {
    //1) get tour data from collection
const tours = await Tour.find();
//2) build template
//3) render that template using tour data from 1)
    res.status(200).render('overview',{title:'all tours',
    tours})
  });

exports.getTour = catchAsync(async(req, res,next) => {
//1) get the data for the requested tour (including reviews and guides)
const tour = await Tour.findOne({slug:req.params.slug}).populate({path:'reviews',fields:'review rating user'}).populate({path:'guides',fields:'name photo role'})

//2) build template
//3) render template using data from 1)
 if(!tour){
    return next(new AppError('there is no tour with that name',404)) 
 }

    res.status(200).render('tour',{title:tour.name,tour})
  });

exports.getLoginForm= catchAsync(async(req, res,next) => {

res.status(200).render('login',{title:'log into your account'})
});

exports.getAccount= catchAsync(async(req, res,next) => {

res.status(200).render('userAccount',{title:'your account'})
})

exports.getSignupForm= catchAsync(async(req, res,next) => {

res.status(200).render('signup',{title:'sign up'})

});