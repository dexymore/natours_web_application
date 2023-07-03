const catchAsync = require('../utils/catchAsync');
// eslint-disable-next-line import/extensions
const AppError = require('../utils/appError');

const Review = require('../models/reviewModal');

exports.getAllReviews= catchAsync(async (req, res,next) => {
const reviews= await Review.find()
res.status(200).json({
    status: 'success',
    results: reviews.length,

    data: { reviews },
  });
 })
 exports.postNewReview=catchAsync(async (req, res,next) => {

    
        const newReview = await Review.create(req.body);
        res.status(201).json({
          status: 'success',
           review:newReview,
        });
      
 })