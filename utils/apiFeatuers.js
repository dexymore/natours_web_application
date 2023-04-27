class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1)filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'limit', 'sort', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    //2)advanced filtering
    // first we chnge the queryobj into string for allowing replace the gt,lt,gtr,lte operators with,the $gtr,$lte,$lt,$gt operators
    // we use the regex of /\b(gt|lt|gte|lte)\b/g which will match the gt,lt,gte,lte operators
    //and then create a callback function to replace the gt,lt,gtr,lte operators with,the $gtr,$lte,$lt,$gt operators
    //then we parse the query into json again and we use the find method of mongoose to get the data
    let querstr = JSON.stringify(queryObj);
    querstr = querstr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // note that its impotant not to use await here in order to make sorting,selecting  and pagination work
    this.query.find(JSON.parse(querstr));
    return this;
  }

  sort() {
    //3)sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  field() {
    //4)feild filtering
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  //5)pagination
  paginate() {
    const page = this.queryString.page * 1 || 1; // Convert page number to a number, or default to 1
    const limit = this.queryString.limit * 1 || 100; // Convert limit to a number, or default to 100
    const skip = (page - 1) * limit; // Calculate the number of documents to skip based on page and limit
    this.query = this.query.skip(skip).limit(limit); // Apply skip and limit to the query
    return this;
  }
}
module.exports = ApiFeatures;



   // //1)filtering
    // // eslint-disable-next-line node/no-unsupported-features/es-syntax
    // const queryObj = { ...req.query };
    // const excludeFields = ['page', 'limit', 'sort', 'fields'];
    // excludeFields.forEach((el) => delete queryObj[el]);
    // //2)advanced filtering
    // // first we chnge the queryobj into string for allowing replace the gt,lt,gtr,lte operators with,the $gtr,$lte,$lt,$gt operators
    // // we use the regex of /\b(gt|lt|gte|lte)\b/g which will match the gt,lt,gte,lte operators
    // //and then create a callback function to replace the gt,lt,gtr,lte operators with,the $gtr,$lte,$lt,$gt operators
    // //then we parse the query into json again and we use the find method of mongoose to get the data
    // let querstr = JSON.stringify(queryObj);
    // querstr = querstr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // // note that its impotant not to use await here in order to make sorting,selecting  and pagination work

    // //3)sorting
    //     if (req.query.sort) {
    //       const sortBy = req.query.sort.split(',').join(' ');
    //       query = query.sort(sortBy);
    //     } else {
    //       query = query.sort('-createdAt');
    //     }
    // //4)feild filtering
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // //5)pagination
    // const page = req.query.page * 1 || 1; // Convert page number to a number, or default to 1
    // const limit = req.query.limit * 1 || 100; // Convert limit to a number, or default to 100
    // const skip = (page - 1) * limit; // Calculate the number of documents to skip based on page and limit
    // query = query.skip(skip).limit(limit); // Apply skip and limit to the query
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('Page not found');
    // }