#!/bin/bash

# Tresidus AI - AWS Amplify Deployment Script

echo "🚀 Starting Tresidus AI deployment to AWS Amplify..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "❌ Amplify CLI is not installed. Installing..."
    npm install -g @aws-amplify/cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Project is ready for AWS Amplify deployment!"
echo ""
echo "Next steps:"
echo "1. Initialize Amplify: amplify init"
echo "2. Add hosting: amplify add hosting"
echo "3. Add API: amplify add api"
echo "4. Deploy: amplify publish"
echo ""
echo "Or use the AWS Amplify Console to connect your Git repository."
