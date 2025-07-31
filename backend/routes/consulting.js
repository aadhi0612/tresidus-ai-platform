const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, '../data');
const CONSULTING_FILE = path.join(DATA_DIR, 'consulting-requests.json');

// Initialize data directory and file
const initializeDataStorage = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Check if file exists, if not create it with empty array
    try {
      await fs.access(CONSULTING_FILE);
    } catch (error) {
      await fs.writeFile(CONSULTING_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error initializing data storage:', error);
  }
};

// Load consulting requests from file
const loadConsultingRequests = async () => {
  try {
    const data = await fs.readFile(CONSULTING_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading consulting requests:', error);
    return [];
  }
};

// Save consulting requests to file
const saveConsultingRequests = async (requests) => {
  try {
    await fs.writeFile(CONSULTING_FILE, JSON.stringify(requests, null, 2));
  } catch (error) {
    console.error('Error saving consulting requests:', error);
    throw error;
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Initialize on module load
initializeDataStorage();

// GET /api/consulting - Get all consulting requests
router.get('/', async (req, res) => {
  try {
    const requests = await loadConsultingRequests();
    res.json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
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
    const requests = await loadConsultingRequests();
    const request = requests.find(r => r.id === req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Consulting request not found'
      });
    }
    
    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consulting request',
      message: error.message
    });
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

    const newRequest = {
      id: generateId(),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
      communications: []
    };

    const requests = await loadConsultingRequests();
    requests.push(newRequest);
    await saveConsultingRequests(requests);

    res.status(201).json({
      success: true,
      message: 'Consulting request submitted successfully',
      data: newRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create consulting request',
      message: error.message
    });
  }
});

// PUT /api/consulting/:id - Update consulting request
router.put('/:id', async (req, res) => {
  try {
    const requests = await loadConsultingRequests();
    const requestIndex = requests.findIndex(r => r.id === req.params.id);
    
    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Consulting request not found'
      });
    }

    const updatedRequest = {
      ...requests[requestIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    requests[requestIndex] = updatedRequest;
    await saveConsultingRequests(requests);

    res.json({
      success: true,
      message: 'Consulting request updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update consulting request',
      message: error.message
    });
  }
});

// POST /api/consulting/:id/communication - Add communication record
router.post('/:id/communication', async (req, res) => {
  try {
    const { type, subject, content, method, followUpRequired, followUpDate } = req.body;

    if (!type || !content) {
      return res.status(400).json({
        success: false,
        error: 'Communication type and content are required'
      });
    }

    const requests = await loadConsultingRequests();
    const requestIndex = requests.findIndex(r => r.id === req.params.id);
    
    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Consulting request not found'
      });
    }

    const communication = {
      id: generateId(),
      type: type, // 'email', 'call', 'meeting', 'note'
      subject: subject || '',
      content: content.trim(),
      method: method || 'email',
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate || null,
      createdAt: new Date().toISOString(),
      createdBy: 'system' // In a real app, this would be the logged-in user
    };

    requests[requestIndex].communications.push(communication);
    requests[requestIndex].updatedAt = new Date().toISOString();
    
    await saveConsultingRequests(requests);

    res.status(201).json({
      success: true,
      message: 'Communication record added successfully',
      data: communication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add communication record',
      message: error.message
    });
  }
});

// DELETE /api/consulting/:id - Delete consulting request
router.delete('/:id', async (req, res) => {
  try {
    const requests = await loadConsultingRequests();
    const requestIndex = requests.findIndex(r => r.id === req.params.id);
    
    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Consulting request not found'
      });
    }

    const deletedRequest = requests.splice(requestIndex, 1)[0];
    await saveConsultingRequests(requests);

    res.json({
      success: true,
      message: 'Consulting request deleted successfully',
      data: deletedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete consulting request',
      message: error.message
    });
  }
});

module.exports = router;
