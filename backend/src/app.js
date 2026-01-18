const express = require('express');
const cors = require('cors');
require('dotenv').config();

const profileRoutes = require('./routes/profile');
const queryRoutes = require('./routes/query');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', profileRoutes);
app.use('/api', queryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Profile not found' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'URL not configured'}`);
});

module.exports = app;