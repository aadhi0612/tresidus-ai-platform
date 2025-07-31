const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const consultingRoutes = require('./routes/consulting');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Tresidus AI Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      projects: '/api/projects',
      analytics: '/api/analytics',
      consulting: '/api/consulting'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API routes
app.get('/api/projects', (req, res) => {
  // This would typically fetch from a database
  res.json({
    message: 'Projects endpoint - to be implemented',
    data: []
  });
});

app.get('/api/analytics', (req, res) => {
  // This would typically fetch analytics data
  res.json({
    message: 'Analytics endpoint - to be implemented',
    data: {
      totalProjects: 9,
      activeClients: 12,
      modelsInProduction: 8
    }
  });
});

// Consulting routes
app.use('/api/consulting', consultingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`🚀 Tresidus Backend Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}`);
    console.log(`📋 Consulting API: http://localhost:${PORT}/api/consulting`);
  });
}

// Export app for serverless deployment
module.exports = app;
