exports.notFound = (req, res, next) => {
    res.status(404).json({ success: false, message: 'Not found' });
  };
  
  exports.errorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Server error',
    });
  };
  