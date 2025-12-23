const internalAuthMiddleware = (req, res, next) => {
  try {
    const internalToken = req.headers['x-internal-secret'];
    
    if (!internalToken) {
      return res.status(401).json({
        success: false,
        message: 'Internal authentication required'
      });
    }

    if (internalToken !== process.env.INTERNAL_API_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Invalid internal credentials'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal authentication error'
    });
  }
};

module.exports = internalAuthMiddleware;
