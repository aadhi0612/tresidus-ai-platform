const serverless = require('serverless-http');
const app = require('./server');

// Export the handler for AWS Lambda
exports.handler = serverless(app);
