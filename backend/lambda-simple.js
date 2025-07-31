const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const consultingRoutes = require('./routes/consulting');

const app = express();

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

// Lambda handler
exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Convert API Gateway event to Express-compatible request
    const method = event.httpMethod || event.requestContext?.http?.method || 'GET';
    const path = event.path || event.rawPath || '/';
    const headers = event.headers || {};
    const body = event.body || '';
    
    // Create a mock request and response
    const req = {
      method,
      url: path,
      headers,
      body: body ? JSON.parse(body) : {},
      query: event.queryStringParameters || {}
    };
    
    const res = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      },
      body: '',
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.body = JSON.stringify(data);
        return this;
      },
      send: function(data) {
        this.body = typeof data === 'string' ? data : JSON.stringify(data);
        return this;
      }
    };
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: res.headers,
        body: ''
      };
    }
    
    // Route the request
    if (path === '/' || path === '') {
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
    } else if (path === '/health') {
      res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    } else if (path === '/api/projects') {
      res.json({
        message: 'Projects endpoint - to be implemented',
        data: []
      });
    } else if (path === '/api/analytics') {
      res.json({
        message: 'Analytics endpoint - to be implemented',
        data: {
          totalProjects: 9,
          activeClients: 12,
          modelsInProduction: 8
        }
      });
    } else if (path.startsWith('/api/consulting')) {
      // Handle consulting routes
      if (method === 'GET' && path === '/api/consulting') {
        res.json({
          message: 'Consulting requests endpoint',
          data: []
        });
      } else {
        res.status(404).json({
          error: 'Route not found',
          message: `Cannot ${method} ${path}`
        });
      }
    } else {
      res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${method} ${path}`
      });
    }
    
    return {
      statusCode: res.statusCode,
      headers: res.headers,
      body: res.body
    };
    
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
