const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'tresidus-consulting-requests';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/consulting - Create new consulting request
router.post('/', async (req, res) => {
  try {
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
    } = req.body;

    // Validation
    if (!name || !email || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and description are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
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
        from: process.env.EMAIL_USER,
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

    res.status(201).json({
      success: true,
      message: 'Consulting request submitted successfully',
      data: { id: requestId, status: 'pending' }
    });
  } catch (error) {
    console.error('Error creating consulting request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create consulting request',
      message: error.message
    });
  }
});

// GET /api/consulting - Get all consulting requests (for admin use)
router.get('/', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME
    };

    const result = await dynamodb.scan(params).promise();

    res.json({
      success: true,
      data: result.Items,
      count: result.Items.length
    });
  } catch (error) {
    console.error('Error fetching consulting requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consulting requests',
      message: error.message
    });
  }
});

// GET /api/consulting/:id - Get specific consulting request
router.get('/:id', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: req.params.id
      }
    };

    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return res.status(404).json({
        success: false,
        error: 'Consulting request not found'
      });
    }
    
    res.json({
      success: true,
      data: result.Item
    });
  } catch (error) {
    console.error('Error fetching consulting request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consulting request',
      message: error.message
    });
  }
});

// PUT /api/consulting/:id - Update consulting request (for admin use)
router.put('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const timestamp = new Date().toISOString();

    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: req.params.id
      },
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

    res.json({
      success: true,
      message: 'Consulting request updated successfully',
      data: result.Attributes
    });
  } catch (error) {
    console.error('Error updating consulting request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update consulting request',
      message: error.message
    });
  }
});

module.exports = router;
