//Here is the middleware to process stuffs kind of SORT, FITERING,
//Pagination,... for sth like Bootcamp, courses, reviews

const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete them from reqStr
  removeFields.forEach(field => delete reqQuery[field]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);
  //Create operater ($gte, $lte, $gt, $lt, $in)
  queryStr = queryStr.replace(/\b(gt|gte|lte|lt|in)\b/g, match => `$${match}`);

  //Finding Resource
  query = model.find(JSON.parse(queryStr));

  //Select field
  if (req.query.select) {
    const fields = req.query.select.replace(/(,)/g, ' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
    // - means exclude that field from fields
  }

  //Sorts
  if (req.query.sort) {
    const sortBy = req.query.sort.replace(/(,)/g, ' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = limit * (page - 1);
  const endIndex = limit * page;
  const total = await model.countDocuments();

  //Executing query
  query = query.skip(startIndex).limit(limit);

  //Check populate
  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

  //pagination result
  const pagination = {};
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  req.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };
  next();
};

module.exports = advancedResults;
