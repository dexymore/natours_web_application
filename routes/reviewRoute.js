const express = require('express')

const reviewController = require('../controllers/reviewController');


const authController=require('../controllers/authController');

const reviewRouter = express.Router({mergeParams:true});

reviewRouter.use(authController.protect)

reviewRouter.route('/').get(reviewController.getAllReviews).post(authController.protect,authController.restrict('user'),reviewController.setToursUserID,reviewController.postNewReview)

reviewRouter.route('/:id').delete(authController.protect, authController.restrict('admin', 'user'),reviewController.deleteReview).patch(authController.protect, authController.restrict('admin', 'user'),reviewController.updateReview).get(reviewController.getReview)
module.exports=reviewRouter


