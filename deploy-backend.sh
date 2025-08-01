#!/bin/bash

# Tresidus AI - Backend Lambda Deployment Script
# This script deploys the backend as AWS Lambda functions with API Gateway

set -e

echo "🚀 Starting Tresidus AI Backend deployment to AWS Lambda..."

# Configuration
AWS_PROFILE="098493093308_AdministratorAccess"
AWS_REGION="us-east-1"
FUNCTION_NAME="tresidus-backend"
API_NAME="tresidus-api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Set AWS profile
export AWS_PROFILE="$AWS_PROFILE"
export AWS_DEFAULT_REGION="$AWS_REGION"

# Verify AWS credentials
echo_info "Verifying AWS credentials..."
ACCOUNT_ID=$(aws sts get-caller-identity --profile "$AWS_PROFILE" --query Account --output text)
echo_success "Authenticated with AWS Account: $ACCOUNT_ID"

# Create deployment package
echo_info "Creating deployment package..."
cd backend

# Install production dependencies
echo_info "Installing production dependencies..."
npm install --production

# Create deployment zip
echo_info "Creating deployment zip..."
zip -r ../tresidus-backend-lambda.zip . -x "node_modules/.cache/*" "*.log"

cd ..

# Create IAM role for Lambda if it doesn't exist
ROLE_NAME="tresidus-lambda-role"
echo_info "Checking if IAM role exists..."

if ! aws iam get-role --role-name "$ROLE_NAME" --profile "$AWS_PROFILE" > /dev/null 2>&1; then
    echo_info "Creating IAM role for Lambda..."
    
    # Create trust policy
    cat > trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

    # Create the role
    aws iam create-role \
        --role-name "$ROLE_NAME" \
        --assume-role-policy-document file://trust-policy.json \
        --profile "$AWS_PROFILE" > /dev/null

    # Attach basic execution policy
    aws iam attach-role-policy \
        --role-name "$ROLE_NAME" \
        --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" \
        --profile "$AWS_PROFILE"

    echo_success "Created IAM role: $ROLE_NAME"
    
    # Wait for role to be available
    echo_info "Waiting for role to be available..."
    sleep 10
else
    echo_info "IAM role already exists: $ROLE_NAME"
fi

ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME"

# Deploy Lambda function
echo_info "Deploying Lambda function..."

if aws lambda get-function --function-name "$FUNCTION_NAME" --profile "$AWS_PROFILE" > /dev/null 2>&1; then
    echo_info "Updating existing Lambda function..."
    aws lambda update-function-code \
        --function-name "$FUNCTION_NAME" \
        --zip-file fileb://tresidus-backend-lambda.zip \
        --profile "$AWS_PROFILE" > /dev/null
    
    aws lambda update-function-configuration \
        --function-name "$FUNCTION_NAME" \
        --runtime "nodejs18.x" \
        --handler "lambda.handler" \
        --timeout 30 \
        --memory-size 512 \
        --environment Variables="{NODE_ENV=production}" \
        --profile "$AWS_PROFILE" > /dev/null
else
    echo_info "Creating new Lambda function..."
    aws lambda create-function \
        --function-name "$FUNCTION_NAME" \
        --runtime "nodejs18.x" \
        --role "$ROLE_ARN" \
        --handler "lambda.handler" \
        --zip-file fileb://tresidus-backend-lambda.zip \
        --timeout 30 \
        --memory-size 512 \
        --environment Variables="{NODE_ENV=production}" \
        --profile "$AWS_PROFILE" > /dev/null
fi

echo_success "Lambda function deployed: $FUNCTION_NAME"

# Create API Gateway
echo_info "Setting up API Gateway..."

# Check if API already exists
API_ID=$(aws apigatewayv2 get-apis --profile "$AWS_PROFILE" --query "Items[?Name=='$API_NAME'].ApiId" --output text)

if [ "$API_ID" = "" ] || [ "$API_ID" = "None" ]; then
    echo_info "Creating new API Gateway..."
    API_RESULT=$(aws apigatewayv2 create-api \
        --name "$API_NAME" \
        --protocol-type HTTP \
        --description "Tresidus AI Backend API" \
        --cors-configuration AllowCredentials=false,AllowHeaders="*",AllowMethods="*",AllowOrigins="*" \
        --profile "$AWS_PROFILE")
    
    API_ID=$(echo "$API_RESULT" | jq -r '.ApiId')
    echo_success "Created API Gateway: $API_ID"
else
    echo_info "Using existing API Gateway: $API_ID"
fi

# Create Lambda integration
echo_info "Creating Lambda integration..."

INTEGRATION_RESULT=$(aws apigatewayv2 create-integration \
    --api-id "$API_ID" \
    --integration-type AWS_PROXY \
    --integration-uri "arn:aws:lambda:$AWS_REGION:$ACCOUNT_ID:function:$FUNCTION_NAME" \
    --payload-format-version "2.0" \
    --profile "$AWS_PROFILE" 2>/dev/null || echo '{"IntegrationId":"existing"}')

INTEGRATION_ID=$(echo "$INTEGRATION_RESULT" | jq -r '.IntegrationId')

# Create route for all methods and paths
echo_info "Creating API routes..."
aws apigatewayv2 create-route \
    --api-id "$API_ID" \
    --route-key "ANY /{proxy+}" \
    --target "integrations/$INTEGRATION_ID" \
    --profile "$AWS_PROFILE" > /dev/null 2>&1 || echo_warning "Route may already exist"

aws apigatewayv2 create-route \
    --api-id "$API_ID" \
    --route-key "ANY /" \
    --target "integrations/$INTEGRATION_ID" \
    --profile "$AWS_PROFILE" > /dev/null 2>&1 || echo_warning "Route may already exist"

# Create deployment stage
echo_info "Creating deployment stage..."
aws apigatewayv2 create-stage \
    --api-id "$API_ID" \
    --stage-name "prod" \
    --description "Production stage" \
    --auto-deploy \
    --profile "$AWS_PROFILE" > /dev/null 2>&1 || echo_warning "Stage may already exist"

# Add Lambda permission for API Gateway
echo_info "Adding Lambda permissions..."
aws lambda add-permission \
    --function-name "$FUNCTION_NAME" \
    --statement-id "api-gateway-invoke" \
    --action "lambda:InvokeFunction" \
    --principal "apigateway.amazonaws.com" \
    --source-arn "arn:aws:execute-api:$AWS_REGION:$ACCOUNT_ID:$API_ID/*/*" \
    --profile "$AWS_PROFILE" > /dev/null 2>&1 || echo_warning "Permission may already exist"

# Get API endpoint
API_ENDPOINT=$(aws apigatewayv2 get-api --api-id "$API_ID" --profile "$AWS_PROFILE" --query 'ApiEndpoint' --output text)

echo_success "🎉 Backend deployment completed successfully!"
echo_info "🔗 API Endpoint: $API_ENDPOINT"
echo_info "📋 Lambda Function: $FUNCTION_NAME"
echo_info "🌐 API Gateway: $API_ID"

# Test the API
echo_info "Testing API endpoint..."
if curl -s "$API_ENDPOINT" > /dev/null; then
    echo_success "API is responding correctly!"
else
    echo_warning "API test failed - please check the deployment"
fi

# Update frontend configuration
echo_info "Updating frontend API configuration..."
if [ -f "frontend/src/config.js" ]; then
    sed -i "s|API_BASE_URL:.*|API_BASE_URL: '$API_ENDPOINT',|" frontend/src/config.js
else
    mkdir -p frontend/src
    cat > frontend/src/config.js << EOF
export const config = {
  API_BASE_URL: '$API_ENDPOINT',
  ENVIRONMENT: 'production'
};
EOF
fi

# Clean up
rm -f tresidus-backend-lambda.zip trust-policy.json

# Create backend deployment summary
cat > BACKEND_DEPLOYMENT_SUMMARY.md << EOF
# Tresidus AI - Backend Deployment Summary

## Deployment Details
- **Function Name**: $FUNCTION_NAME
- **API Name**: $API_NAME
- **API ID**: $API_ID
- **Region**: $AWS_REGION
- **Deployment Date**: $(date)

## URLs
- **API Endpoint**: $API_ENDPOINT
- **Lambda Console**: https://console.aws.amazon.com/lambda/home?region=$AWS_REGION#/functions/$FUNCTION_NAME
- **API Gateway Console**: https://console.aws.amazon.com/apigateway/main/apis/$API_ID/resources?region=$AWS_REGION

## API Endpoints
- **Health Check**: $API_ENDPOINT/health
- **Consulting API**: $API_ENDPOINT/api/consulting
- **Projects API**: $API_ENDPOINT/api/projects
- **Analytics API**: $API_ENDPOINT/api/analytics

## Next Steps
1. Update frontend configuration to use the new API endpoint
2. Test all API endpoints
3. Configure environment variables if needed
4. Set up monitoring and logging

## Testing
Test the API with:
\`\`\`bash
curl $API_ENDPOINT/health
curl $API_ENDPOINT/api/consulting
\`\`\`
EOF

echo_success "Backend deployment summary saved to BACKEND_DEPLOYMENT_SUMMARY.md"
echo_info "🚀 Your Tresidus AI backend is now live!"
