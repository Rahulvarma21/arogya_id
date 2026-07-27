const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error console for development
  console.error(err);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Multer Error
  if (err.code === 'LIMIT_FILE_SIZE') {
    error.message = 'File size exceeds the 5MB limit';
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
