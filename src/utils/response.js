// Response utility functions

// Success response
export const success = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data
  });
};

// Error response
export const error = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: statusCode
    }
  });
};

// Paginated response
export const paginated = (res, data, pagination) => {
  res.json({
    success: true,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit)
    }
  });
};
