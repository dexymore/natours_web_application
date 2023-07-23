const AppError = require(`../utils/appError`);

const handleCastErrorDB = function (err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
return new AppError(message, 400);

 
};
const handleValidationErrorDB = (err) => {
  const errors=Object.values(err.errors).map(el=>el.message);
  const message = `invalid input data. ${errors.join(', ')}`;
  return new AppError(message,400)
}

const handleDuplicateFieldDb =function (err)  {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value)
  const message = `duplicate feild value:${value}`
  return new AppError(message, 400);
};

const handleJwtError=()=> new AppError('invalid token.please login again',401)


const sendErorrDev = (err,req ,res) => {

  //operational error :send message to client
  if(req.originalUrl.startsWith('/api')){
   res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack:err.stack
    });
  }else{
 res.status(err.statusCode).render('error',{
      title:'something went wrong',
      msg:err.message
    })
  }

   
};

const sendErorrProd = (err, req,res) => {
 // A) API
 if (req.originalUrl.startsWith('/api')) {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
}

// B) RENDERED WEBSITE
// A) Operational, trusted error: send message to client
if (err.isOperational) {
  // console.log(err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
}
// B) Programming or other unknown error: don't leak error details
// 1) Log error
console.error('ERROR 💥', err);
// 2) Send generic message
return res.status(err.statusCode).render('error', {
  title: 'Something went wrong!',
  msg: 'Please try again later.'
});
};


module.exports = (err, req, res, next) => {
  // Set default status code and status if not already set
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Send error response based on environment
  if (process.env.NODE_ENV === 'development') {
  
   sendErorrDev(err,req, res);
  } else {

    let error = {... err };
error.message=err.message
    // Handle specific error types
    if (err.name === 'CastError') {

      error = handleCastErrorDB(err);
    }
    if (err.name === 'ValidationError') { 

      error = handleValidationErrorDB(err);
    }
    if (err.name === 'JsonWebToken')
    {
  error=handleJwtError()   
  
    }

    sendErorrProd(error,req, res);
  }
};