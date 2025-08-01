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
  res.json({
    message: 'Projects endpoint - to be implemented',
    data: []
  });
});

app.get('/api/analytics', (req, res) => {
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

// Lambda handler function
exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  return new Promise((resolve, reject) => {
    // Handle API Gateway path with stage prefix
    let path = event.path || event.rawPath || '/';
    if (path.startsWith('/prod')) {
      path = path.substring(5) || '/';
    }
    
    const req = {
      method: event.httpMethod || event.requestContext?.http?.method || 'GET',
      url: path,
      headers: event.headers || {},
      body: event.body || null,
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
        resolve(this);
      },
      send: function(data) {
        this.body = typeof data === 'string' ? data : JSON.stringify(data);
        resolve(this);
      }
    };

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return resolve({
        statusCode: 200,
        headers: res.headers,
        body: ''
      });
    }

    try {
      // Simple routing
      if (req.url === '/' || req.url === '') {
        return res.json({
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
      }

      if (req.url === '/health') {
        return res.json({
          status: 'healthy',
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        });
      }

      if (req.url === '/api/projects') {
        return res.json({
          message: 'Projects endpoint - to be implemented',
          data: []
        });
      }

      if (req.url === '/api/analytics') {
        return res.json({
          message: 'Analytics endpoint - to be implemented',
          data: {
            totalProjects: 9,
            activeClients: 12,
            modelsInProduction: 8
          }
        });
      }

      if (req.url.startsWith('/api/consulting')) {
        // Handle consulting routes
        const fs = require('fs');
        const path = require('path');
        
        const dataFile = path.join(__dirname, 'data', 'consulting-requests.json');
        
        if (req.method === 'GET') {
          try {
            if (fs.existsSync(dataFile)) {
              const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
              return res.json(data);
            } else {
              return res.json([]);
            }
          } catch (error) {
            return res.status(500).json({ error: 'Failed to read consulting data' });
          }
        }

        if (req.method === 'POST') {
          try {
            const newRequest = JSON.parse(req.body || '{}');
            newRequest.id = Date.now().toString();
            newRequest.createdAt = new Date().toISOString();
            newRequest.status = 'pending';

            let requests = [];
            if (fs.existsSync(dataFile)) {
              requests = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            }

            requests.push(newRequest);
            
            // Ensure directory exists
            const dir = path.dirname(dataFile);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(dataFile, JSON.stringify(requests, null, 2));
            return res.status(201).json(newRequest);
          } catch (error) {
            return res.status(500).json({ error: 'Failed to save consulting request' });
          }
        }
      }

      // 404 for other routes
      return res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.url}`
      });

    } catch (error) {
      console.error('Lambda error:', error);
      return resolve({
        statusCode: 500,
        headers: res.headers,
        body: JSON.stringify({
          error: 'Internal server error',
          message: error.message
        })
      });
    }
  });
};
