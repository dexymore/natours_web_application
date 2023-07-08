const express = require('express');

const catchAsync= require('../utils/catchAsync')

// eslint-disable-next-line import/extensions
// const ApiFeatures = require('../utils/apiFeatuers');
const Tour = require('../models/tourModal');
// const AppError = require('../utils/appError');

const factory=require('./handlerFactory');
const AppError = require('../utils/appError');

const app = express();

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // here we set the request time to the current time
  next();
});
// a middleware to set the top cheapset tours
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

exports.getAllTours =factory.getAlldocs(Tour)

exports.getTour = factory.getOne(Tour,{path:'reviews'})
exports.createTour =factory.createOne(Tour)
exports.updateTour =factory.updateOne(Tour)

// exports.delteTour =catchAsync( async (req, res,next) => {

//     const tour=await Tour.findByIdAndDelete(req.params.id);
//     if (!tour) { 
//       return  next(new AppError(`no tour found with that id `  ,404))
//      }  
//   res.status(204).json({
//       status: 'success',
//       data: null,
//     });
  
// });


exports.delteTour=factory.deleteOne(Tour)

//aggregtion pipeline with moongoose
// In this code, _id is used as a grouping operator in the MongoDB aggregation pipeline. It specifies the field that will be used to group the documents in the collection.

// In this specific example, $difficulty field is being used as the _id for the grouping operation. So, the documents in the collection will be grouped by their difficulty value, and the results will be aggregated based on this grouping.

// The $group operator in the pipeline is then used to define the aggregation operations that will be performed on the grouped documents. These operations include calculating the number of ratings, number of tours, average rating, average price, minimum price, and maximum price for each difficulty level.

// Finally, the $sort operator is used to sort the results by the average price in ascending order.

// The resulting data will be sent as a JSON response to the client with a success status or an error status if an error occurred during the aggregation process.
exports.getToursStats =catchAsync( async (req, res) => {

    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numRatings: { $sum: '$ratingsQuantity' },
          numtours: { $sum: 1 },
          avgrating: { $avg: '$ratingsAverage' },
          avgPRICE: { $avg: '$price' },
          minPRICE: { $min: '$price' },
          maxPRICE: { $max: '$price' },
        },
      },
      {
        $sort: { avgPRICE: 1 },
      },
    ]);
    res.status(200).json({ status: 'success', data: { stats } });
  
});
// This is a function in an ExpressJS application that uses the Mongoose library for MongoDB to retrieve the monthly plan of tours based on a given year.

// The function takes in a request and response object as parameters and is an asynchronous function. It first extracts the year from the request parameters and converts it to a number.

// It then uses the Mongoose aggregation pipeline to perform the following operations on the "Tour" collection:

// $unwind: This operator is used to deconstruct the "startDates" array field in the documents and create a separate document for each element of the array.

// $match: This operator is used to filter the documents based on the "startDates" field, such that only documents with dates between the start and end of the given year are selected.

// $group: This operator is used to group the filtered documents by the month of the "startDates" field, and calculate the number of tours that start in that month, and create an array of the names of those tours.

// $addFields: This operator is used to add a new field "month" to the documents, which is equal to the "_id" field (month) of the previous grouping.

// $project: This operator is used to remove the "_id" field from the documents.

// $sort: This operator is used to sort the documents based on the "numtoursStarts" field in descending order.

// $limit: This operator is used to limit the number of documents to 12.

// Finally, the function sends a response to the client with the status code 200 and a JSON object containing the monthly plan data retrieved from the database. If there is an error, the function sends an error response with the status code 500 and an error message.

exports.getMonthlyPlan =catchAsync( async (req, res) => {

    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numtoursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      { $sort: { numtoursStarts: -1 } },
      { $limit: 12 },
    ]);
    res.status(200).json({ status: 'success', data: { plan } });
 
});
// const tours = JSON.parse(
//   // reading the the tours file which is containing data about the tours

//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// );

//middleware to if the id is valid
// exports.validateId = (req, res, next, val) => {
//   if (req.params.id * 1 < 0 || req.params.id * 1 > tours.length) {
//     res.status(404).json({ status: 'error', message: 'tour notfound' });
//   }
//   next();
// };

//middleware to chek if there mising data while creating a new tour

// exports.checkbody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({ status: 'error', message: 'missing data' });
//   }

//   next();
// };

exports.getToursWithin =catchAsync( async (req, res,next) => {
const{distance,latlng,unit}=req.params
const [lat,lng]=latlng.split(',')
const radius=unit==='mi'? distance/3963.2:distance/6378.1
if(!lat||!lng)next(new AppError("please provide latitutr and longitude in the fromat like this lat,lng.",400))
const tours=await Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}})
res.status(200).json({
status:"success",
results:tours.length,
data:{
  data:tours
}
})
 });

exports.getDistances=catchAsync( async (req, res,next) => {

  const{latlng,unit}=req.params
  const [lat,lng]=latlng.split(',')
  const multiplier=unit==='mi'? 0.000621371:0.001
  if(!lat||!lng)next(new AppError("please provide latitutr and longitude in the fromat like this lat,lng.",400))
  const distances=await Tour.aggregate([
    {
      $geoNear:{
        near:{
          type:'Point',
          coordinates:[lng*1,lat*1]
        },
        distanceField:'distance',
        distanceMultiplier:multiplier
      }
    },
    {
      $project:{
        distance:1,
        name:1
      }
    }
  ])
  res.status(200).json({
  status:"success",
  results:distances.length,
  data:{
    data:distances
  }
  })
})