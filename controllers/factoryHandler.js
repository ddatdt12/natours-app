const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const APIFeature = require('../utils/APIFeature');

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    //
    const filter = {};
    if (req.params.tourId) filter.tour = req.params.tourId;

    const features = new APIFeature(Model.find(filter), req.query)
      .filter()
      .select()
      .sort()
      .paginate();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) {
      return next(
        new AppError(`No document found with id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { data: doc }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(
        new AppError(`No document found with id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc }
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(`Document not found with ${req.params.id} `));
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  });
