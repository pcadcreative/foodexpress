require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const recommendationRoutes = require('./routes/recommendationRoutes');
const internalRoutes = require('./routes/internalRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({
    service: 'Recommendation Service',
    status: 'running',
    version: '1.0.0'
  });
});

app.use('/api/recommendations', recommendationRoutes);
app.use('/internal/recommendation', internalRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Recommendation Service running on port ${PORT}`);
});

module.exports = app;
