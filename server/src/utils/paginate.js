/**
 * Generic Pagination Utility for Mongoose Queries
 * 
 * @param {Object} model - Mongoose Model
 * @param {Object} query - Mongoose query object (filters)
 * @param {Number} page - Current page number
 * @param {Number} limit - Items per page
 * @param {Object} options - Populate, sort, select configs
 * @returns {Promise<Object>} { data, pagination: { total, page, pages, limit } }
 */
const paginate = async (model, query = {}, page = 1, limit = 10, options = {}) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;

    // Count total documents
    const total = await model.countDocuments(query);

    // Build the query
    let mongooseQuery = model.find(query);

    if (options.select) {
        mongooseQuery = mongooseQuery.select(options.select);
    }
    if (options.sort) {
        mongooseQuery = mongooseQuery.sort(options.sort);
    } else {
        mongooseQuery = mongooseQuery.sort({ createdAt: -1 }); // Default sort newest first
    }
    if (options.populate) {
        mongooseQuery = mongooseQuery.populate(options.populate);
    }

    // Execute with pagination blocks
    mongooseQuery = mongooseQuery.skip(startIndex).limit(limitNum);
    const data = await mongooseQuery.lean();

    return {
        data,
        pagination: {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            limit: limitNum,
            hasNextPage: pageNum * limitNum < total,
            hasPrevPage: pageNum > 1
        }
    };
};

module.exports = paginate;
