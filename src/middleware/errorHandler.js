// Global error handling middleware

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Operational errors (known errors)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.statusCode
      }
    });
  }

  // Programming or unknown errors
  return res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 404
    }
  });
};
