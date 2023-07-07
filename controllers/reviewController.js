

const Review = require('../models/reviewModal');

const factory=require('./handlerFactory')


 
exports.setToursUserID=(req, res,next) => {
  if(!req.body.tour)req.body.tour=req.params.tourId
  if(!req.body.user)req.body.user=req.user.id
  next()
} 

exports.getAllReviews= factory.getAlldocs(Review)
exports.postNewReview=factory.createOne(Review)
exports.deleteReview=factory.deleteOne(Review)
exports.updateReview=factory.updateOne(Review)
exports.getReview=factory.getOne(Review)
