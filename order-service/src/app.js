require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { startOrderStatusUpdater } = require('./services/orderStatusUpdater');

const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Start automatic order status updater (checks every 1 minute)
    startOrderStatusUpdater(1);
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({
    service: 'Order & Delivery Service',
    status: 'running',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});

module.exports = app;
