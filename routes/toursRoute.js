const express = require('express');
// const reviewController = require('../controllers/reviewController');
const reviewRouter=require('./reviewRoute')
const auth = require('../controllers/authController');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  delteTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances
} = require('../controllers/tourControllers');

const toursRouter = express.Router();
// toursRouter.param('id', validateId);
toursRouter.use('/:tourId/reviews',reviewRouter)
toursRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
toursRouter.route('/tour-stats').get(getToursStats);
toursRouter.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin)
toursRouter.route('/distances/:latlng/unit/:unit').get(getDistances)
toursRouter.route('/').get( getAllTours).post(auth.protect, auth.restrict('admin', 'lead-guide'),createTour);
toursRouter.route('/monthly-plan/:year').get(auth.protect, auth.restrict('admin', 'lead-guide','guide'),getMonthlyPlan);
toursRouter
  .route('/:id')
  .get(getTour)
  .patch(auth.protect, auth.restrict('admin', 'lead-guide'),updateTour)
  .delete(auth.protect, auth.restrict('admin', 'lead-guide'), delteTour);
// toursRouter
//   .route('/:tourId/reviews')
//   .post(auth.protect, auth.restrict('user'), reviewController.postNewReview);


module.exports = toursRouter;
