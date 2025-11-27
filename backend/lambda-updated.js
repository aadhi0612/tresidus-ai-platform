const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'tresidus-consulting-requests';

// Configure nodemailer
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'support@tresidus.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Lambda handler
exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const method = event.httpMethod || event.requestContext?.http?.method || 'GET';
    const path = event.path || event.rawPath || '/';
    const headers = event.headers || {};
    const body = event.body ? JSON.parse(event.body) : {};
    const queryParams = event.queryStringParameters || {};
    
    // CORS headers
    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    };
    
    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }
    
    // Route handling
    if (path === '/' || path === '') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
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
        })
      };
    }
    
    if (path === '/health') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          status: 'healthy',
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        })
      };
    }
    
    if (path === '/api/projects') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Projects endpoint',
          data: []
        })
      };
    }
    
    if (path === '/api/analytics') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          message: 'Analytics endpoint',
          data: {
            totalProjects: 9,
            activeClients: 12,
            modelsInProduction: 8
          }
        })
      };
    }
    
    // Consulting routes
    if (path.startsWith('/api/consulting')) {
      return await handleConsultingRoutes(method, path, body, queryParams, corsHeaders);
    }
    
    // 404 for unknown routes
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Route not found',
        message: `Cannot ${method} ${path}`
      })
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

// Handle consulting routes
async function handleConsultingRoutes(method, path, body, queryParams, corsHeaders) {
  try {
    // POST /api/consulting - Create new consulting request
    if (method === 'POST' && path === '/api/consulting') {
      const {
        name,
        email,
        company,
        phone,
        projectType,
        budget,
        timeline,
        description,
        preferredDate,
        preferredTime,
        communicationPreference
      } = body;

      // Validation
      if (!name || !email || !description) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Missing required fields: name, email, and description are required'
          })
        };
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Invalid email format'
          })
        };
      }

      const requestId = uuidv4();
      const timestamp = new Date().toISOString();

      const newRequest = {
        id: requestId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company?.trim() || '',
        phone: phone?.trim() || '',
        projectType: projectType || 'General Consulting',
        budget: budget || 'Not specified',
        timeline: timeline || 'Flexible',
        description: description.trim(),
        preferredDate: preferredDate || '',
        preferredTime: preferredTime || '',
        communicationPreference: communicationPreference || 'email',
        status: 'pending',
        createdAt: timestamp,
        updatedAt: timestamp
      };

      // Save to DynamoDB
      const params = {
        TableName: TABLE_NAME,
        Item: newRequest
      };

      await dynamodb.put(params).promise();

      // Send email notification
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER || 'support@tresidus.com',
          to: 'support@tresidus.com',
          subject: `New Consulting Request from ${name}`,
          html: `
            <h2>New Consulting Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || 'Not specified'}</p>
            <p><strong>Phone:</strong> ${phone || 'Not specified'}</p>
            <p><strong>Project Type:</strong> ${projectType}</p>
            <p><strong>Budget:</strong> ${budget}</p>
            <p><strong>Timeline:</strong> ${timeline}</p>
            <p><strong>Preferred Date:</strong> ${preferredDate || 'Not specified'}</p>
            <p><strong>Preferred Time:</strong> ${preferredTime || 'Not specified'}</p>
            <p><strong>Communication Preference:</strong> ${communicationPreference}</p>
            <p><strong>Description:</strong></p>
            <p>${description}</p>
            <p><strong>Request ID:</strong> ${requestId}</p>
            <p><strong>Submitted:</strong> ${timestamp}</p>
          `
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails
      }

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Consulting request submitted successfully',
          data: { id: requestId, status: 'pending' }
        })
      };
    }

    // GET /api/consulting - Get all consulting requests
    if (method === 'GET' && path === '/api/consulting') {
      const params = {
        TableName: TABLE_NAME
      };

      const result = await dynamodb.scan(params).promise();

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          data: result.Items,
          count: result.Items.length
        })
      };
    }

    // GET /api/consulting/:id - Get specific consulting request
    if (method === 'GET' && path.match(/^\/api\/consulting\/[^\/]+$/)) {
      const id = path.split('/').pop();
      
      const params = {
        TableName: TABLE_NAME,
        Key: { id }
      };

      const result = await dynamodb.get(params).promise();
      
      if (!result.Item) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            error: 'Consulting request not found'
          })
        };
      }
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          data: result.Item
        })
      };
    }

    // PUT /api/consulting/:id - Update consulting request
    if (method === 'PUT' && path.match(/^\/api\/consulting\/[^\/]+$/)) {
      const id = path.split('/').pop();
      const { status, notes } = body;
      const timestamp = new Date().toISOString();

      const params = {
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': timestamp
        },
        ReturnValues: 'ALL_NEW'
      };

      if (notes) {
        params.UpdateExpression += ', notes = :notes';
        params.ExpressionAttributeValues[':notes'] = notes;
      }

      const result = await dynamodb.update(params).promise();

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Consulting request updated successfully',
          data: result.Attributes
        })
      };
    }

    // Unknown consulting route
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Consulting route not found',
        message: `Cannot ${method} ${path}`
      })
    };

  } catch (error) {
    console.error('Error in consulting routes:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: 'Failed to process consulting request',
        message: error.message
      })
    };
  }
}