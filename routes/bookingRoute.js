const express = require('express');

const bookingController = require('../controllers/bookingController');

const authController = require('../controllers/authController');

const bookingRouter = express.Router();

bookingRouter.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

// bookingRouter.use(
//   authController.restrict('admin', 'lead-guide'),
//   authController.protect
// );

bookingRouter
  .route('/')
  .get(
    authController.protect,
    authController.restrict('admin', 'lead-guide'),
    bookingController.getAllBookings
  )
  .post(
    authController.protect,
    authController.restrict('admin', 'lead-guide'),
    bookingController.createBooking
  );

bookingRouter.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking).delete(bookingController.deleteBooking);

module.exports = bookingRouter;
