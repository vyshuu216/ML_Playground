const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const experimentRoutes = require('./routes/experiment');
const mlRoutes = require('./routes/ml');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/experiments', experimentRoutes);
app.use('/api/ml', mlRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ML Playground API running' });
});

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ml_playground')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });
