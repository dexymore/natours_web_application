module.exports = fn => {              // export a middleware function that takes in `fn` as a parameter
    return (req, res, next) => {      // return a new middleware function that takes in `req`, `res`, and `next` as parameters
        fn(req, res, next)            // call `fn` with the same parameters
            .catch(err => next(err)); // attach a `.catch()` method to handle any errors that occur in `fn`
                                      // if an error occurs, pass it to `next`
    }
}