const City = require('../models/City');

exports.getCities = async (req, res, next) => {
  try {
    const cities = await City.find({ isActive: true }).select('name state');
    
    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    next(error);
  }
};
