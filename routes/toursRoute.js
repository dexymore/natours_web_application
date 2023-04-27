const express = require('express');

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
} = require('../controllers/tourControllers');

const toursRouter = express.Router();
// toursRouter.param('id', validateId);

toursRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);
toursRouter.route('/tour-stats').get(getToursStats);
toursRouter.route('/').get(auth.protect, getAllTours).post(createTour);
toursRouter.route('/monthly-plan/:year').get(getMonthlyPlan);
toursRouter.route('/:id').get(getTour).patch(updateTour).delete(auth.protect, auth.restrict("admin","lead-guide"),delteTour);
module.exports = toursRouter;
