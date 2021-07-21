class APIFeature {
  // QueryStr is query which is passed from url
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach(field => delete queryObj[field]);

    //Create query string
    let queryStr = JSON.stringify(queryObj);
    //Create operater ($gte, $lte, $gt, $lt, $in)
    queryStr = queryStr.replace(
      /\b(gt|gte|lte|lt|in)\b/g,
      match => `$${match}`
    );
    //Finding Resource
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  select() {
    //Select field
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.replace(/(,)/g, ' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
      // - means exclude that field from fields
    }
    return this;
  }

  sort() {
    //Sorts
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.replace(/(,)/g, ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate() {
    //Pagination
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 10;
    const startIndex = limit * (page - 1);
    this.query = this.query.skip(startIndex).limit(limit);

    return this;
  }
}

module.exports = APIFeature;
