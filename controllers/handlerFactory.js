const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');

const ApiFeatures = require('../utils/apiFeatuers');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`no document found found with that id `, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // first we check if the tour exists

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError(`no document found with that id `, 404));
    }

    res.status(200).json({ status: 'success', data: { data: doc } });

    // if the tour does not exist we send code 404 which indicates that the tour does not exist
  });
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { data: doc },
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = Model.findById(req.params.id).populate('reviews');
    const doc = await query;
    if (!doc) {
      return next(new AppError(`no document found with that id `, 404));
    }

    res.status(200).json({ status: 'success', data: { doc } });
  });

exports.getAlldocs = (Model) =>
  catchAsync(async (req, res, next) => {
    //to allow nested get reviews for a specific tour  tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    //////////////////////////////////////////////////////////
    const featuers = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .field()
      .paginate();
    // const docs = await featuers.query.explain();
    const docs = await featuers.query;
    res.status(200).json({
      status: 'success',
      results: docs.length,

      data: { data: docs },
    });
    
  });
