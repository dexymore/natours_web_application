const morgan = require('morgan');
const express = require('express'); // Express web server framework makes node js more convenient amd easy to use

const AppError=require('./utils/appError')

const globalErorrHandler= require('./controllers/errorController')

const toursRouter = require('./routes/toursRoute');
const usersRouter = require('./routes/usersRoute');

const app = express(); // create our app with express


//1) middlewares

app.use(express.json()); //using middleware

// app.use((req, res, next) => {
//   console.log('hello from middleware'); // middleware is somthing stands in the middle between the request and the response cycl
//   // in order to use the middleware we need to use the "USE METHOD" and then craate a function with three parameters
//   // the first is our request and the second is the response the third is the next function which allow us to move to the next middleware function
//   // in order to move we need to call the next() function at the end of the middleware
//   // not that in express everthing goes sequntial so the middleware should be before the request resaponse function you want to use the middleware at
//   next();
// });
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // log every request to the console
}else app.use(morgan('prod')); // log every request to the console
///////////////////////////////////////////////////////

app.get('/', (req, res) => {
  // when the user visits the homepage, we send hello world and everything is fine

  res.status(200).json({ message: 'Hello World!', app: 'natours' });
});
app.post('/', (req, res) => {
  res.send('you can send a post request');
});

/////////////////////////////////

//2) route handlers

///users routes handlers

//3)routes

app.use('/api/v1/users', usersRouter);

app.use('/api/v1/tours', toursRouter);
 //the idea of this function is that if we reached this point at our coe thats mean that we neither could resolved the requested path 
 // at our tours and our users routes also so we made this middleware to send the an error response to end users 

//  This function is an Express middleware that handles any request to a route that does not exist on the server.
// It sends a JSON object back to the client with a status code of 404(Not Found) and a message indicating that the requested URL could not be found on the server.
//The message includes the original URL that was requested by the client.The next() function is called after sending the response,
// but it is unnecessary in this case since this middleware is already the last in the middleware chain.
//The next() function is typically used to pass control to the next middleware function in the chain.
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: '404 Not Found',
  //   message:`cant find ${req.originalUrl} on this server`,
  // })
  next(new AppError(`can't find ${req.originalUrl} on this server`,404));
})

app.use(globalErorrHandler)

module.exports = app;
