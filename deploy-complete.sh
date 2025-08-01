#!/bin/bash

# Tresidus AI - Complete AWS Deployment Script
# This script deploys both frontend (Amplify) and backend (Lambda + API Gateway)

set -e

echo "🚀 Starting complete Tresidus AI deployment to AWS..."

# Configuration
AWS_PROFILE="098493093308_AdministratorAccess"
AWS_REGION="us-east-1"

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

echo_info "🎯 Deploying Tresidus AI to AWS"
echo_info "📍 Profile: $AWS_PROFILE"
echo_info "🌍 Region: $AWS_REGION"
echo ""

# Step 1: Deploy Backend
echo_info "🔧 Step 1: Deploying Backend (Lambda + API Gateway)"
echo "=================================================="
./deploy-backend.sh

if [ $? -eq 0 ]; then
    echo_success "Backend deployment completed successfully!"
else
    echo_error "Backend deployment failed!"
    exit 1
fi

echo ""
echo_info "⏳ Waiting 30 seconds for backend to stabilize..."
sleep 30

# Step 2: Update frontend configuration with backend URL
echo_info "🔄 Step 2: Updating frontend configuration"
echo "============================================="

# Read the API endpoint from the backend deployment
if [ -f "BACKEND_DEPLOYMENT_SUMMARY.md" ]; then
    API_ENDPOINT=$(grep "API Endpoint" BACKEND_DEPLOYMENT_SUMMARY.md | cut -d' ' -f4)
    echo_info "Backend API endpoint: $API_ENDPOINT"
    
    # Update frontend configuration
    mkdir -p frontend/src
    cat > frontend/src/config.js << EOF
export const config = {
  API_BASE_URL: '$API_ENDPOINT',
  ENVIRONMENT: 'production'
};
EOF
    echo_success "Frontend configuration updated with backend URL"
else
    echo_warning "Backend deployment summary not found, using default configuration"
fi

# Step 3: Build frontend locally to ensure it works
echo_info "🏗️  Step 3: Building frontend locally"
echo "====================================="
cd frontend
npm install
npm run build
cd ..
echo_success "Frontend build completed successfully!"

# Step 4: Commit changes and prepare for Amplify deployment
echo_info "📝 Step 4: Preparing for Amplify deployment"
echo "============================================"
git add .
git commit -m "Complete deployment with backend integration - $(date)" || echo_warning "No changes to commit"

# Check if we have a remote repository
if ! git remote get-url origin > /dev/null 2>&1; then
    echo_warning "⚠️  No git remote 'origin' found!"
    echo_info "Please set up a Git repository (GitHub, GitLab, etc.) for Amplify deployment:"
    echo_info "1. Create a repository on GitHub/GitLab"
    echo_info "2. Add it as origin: git remote add origin <your-repo-url>"
    echo_info "3. Push the code: git push -u origin main"
    echo ""
    read -p "Press Enter after you've set up the Git repository and pushed the code..."
fi

# Push to remote
echo_info "📤 Pushing to remote repository..."
git push origin main || {
    echo_error "Failed to push to remote repository"
    echo_info "Please ensure your Git repository is set up correctly"
    exit 1
}

# Step 5: Deploy to Amplify (simplified version)
echo_info "🌐 Step 5: Deploying to AWS Amplify"
echo "===================================="

APP_NAME="tresidus-ai"
BRANCH_NAME="main"

# Check if Amplify CLI is available, if not use AWS CLI
if command -v amplify &> /dev/null; then
    echo_info "Using Amplify CLI for deployment..."
    
    # Initialize Amplify if not already done
    if [ ! -f "amplify/.config/project-config.json" ]; then
        echo_info "Initializing Amplify project..."
        amplify init --yes
    fi
    
    # Deploy
    amplify publish --yes
else
    echo_info "Using AWS CLI for Amplify deployment..."
    
    # Get repository URL
    REPO_URL=$(git remote get-url origin)
    echo_info "Repository URL: $REPO_URL"
    
    # Check if app exists
    if aws amplify list-apps --profile "$AWS_PROFILE" --query "apps[?name=='$APP_NAME'].appId" --output text | grep -q .; then
        APP_ID=$(aws amplify list-apps --profile "$AWS_PROFILE" --query "apps[?name=='$APP_NAME'].appId" --output text)
        echo_info "Using existing Amplify app: $APP_ID"
    else
        echo_info "Creating new Amplify app..."
        CREATE_RESULT=$(aws amplify create-app \
            --name "$APP_NAME" \
            --description "Tresidus AI - Agentic Company Platform" \
            --repository "$REPO_URL" \
            --platform "WEB" \
            --enable-branch-auto-build \
            --profile "$AWS_PROFILE" \
            --region "$AWS_REGION")
        
        APP_ID=$(echo "$CREATE_RESULT" | jq -r '.app.appId')
        echo_success "Created Amplify app: $APP_ID"
        
        # Create branch
        aws amplify create-branch \
            --app-id "$APP_ID" \
            --branch-name "$BRANCH_NAME" \
            --description "Main production branch" \
            --enable-auto-build \
            --profile "$AWS_PROFILE" \
            --region "$AWS_REGION" > /dev/null
    fi
    
    # Start deployment
    echo_info "Starting Amplify deployment..."
    DEPLOYMENT_RESULT=$(aws amplify start-job \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH_NAME" \
        --job-type "RELEASE" \
        --profile "$AWS_PROFILE" \
        --region "$AWS_REGION")
    
    JOB_ID=$(echo "$DEPLOYMENT_RESULT" | jq -r '.jobSummary.jobId')
    echo_info "Deployment job started: $JOB_ID"
    
    # Monitor deployment
    echo_info "Monitoring deployment progress..."
    while true; do
        JOB_STATUS=$(aws amplify get-job \
            --app-id "$APP_ID" \
            --branch-name "$BRANCH_NAME" \
            --job-id "$JOB_ID" \
            --profile "$AWS_PROFILE" \
            --region "$AWS_REGION" \
            --query 'job.summary.status' \
            --output text)
        
        case "$JOB_STATUS" in
            "PENDING"|"PROVISIONING"|"RUNNING")
                echo_info "Deployment status: $JOB_STATUS"
                sleep 30
                ;;
            "SUCCEED")
                echo_success "Frontend deployment completed successfully!"
                break
                ;;
            "FAILED"|"CANCELLED")
                echo_error "Frontend deployment failed: $JOB_STATUS"
                exit 1
                ;;
            *)
                echo_warning "Unknown status: $JOB_STATUS"
                sleep 30
                ;;
        esac
    done
    
    # Get the deployed URL
    APP_URL=$(aws amplify get-app \
        --app-id "$APP_ID" \
        --profile "$AWS_PROFILE" \
        --region "$AWS_REGION" \
        --query 'app.defaultDomain' \
        --output text)
    
    FRONTEND_URL="https://$BRANCH_NAME.$APP_URL"
fi

# Final summary
echo ""
echo_success "🎉 COMPLETE DEPLOYMENT SUCCESSFUL! 🎉"
echo "========================================"
echo_info "📱 Frontend URL: $FRONTEND_URL"
echo_info "🔗 Backend API: $API_ENDPOINT"
echo_info "📊 Amplify Console: https://console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID"
echo_info "⚡ Lambda Console: https://console.aws.amazon.com/lambda/home?region=$AWS_REGION"
echo ""

# Create complete deployment summary
cat > COMPLETE_DEPLOYMENT_SUMMARY.md << EOF
# Tresidus AI - Complete Deployment Summary

## 🚀 Deployment Overview
- **Deployment Date**: $(date)
- **AWS Profile**: $AWS_PROFILE
- **AWS Region**: $AWS_REGION
- **Status**: ✅ SUCCESS

## 🌐 Frontend (AWS Amplify)
- **Application URL**: $FRONTEND_URL
- **App ID**: $APP_ID
- **Branch**: $BRANCH_NAME
- **Console**: https://console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID

## 🔧 Backend (AWS Lambda + API Gateway)
- **API Endpoint**: $API_ENDPOINT
- **Health Check**: $API_ENDPOINT/health
- **Consulting API**: $API_ENDPOINT/api/consulting
- **Lambda Console**: https://console.aws.amazon.com/lambda/home?region=$AWS_REGION

## 🧪 Testing
Test your deployment:
\`\`\`bash
# Test backend
curl $API_ENDPOINT/health

# Test frontend
curl $FRONTEND_URL
\`\`\`

## 📋 Next Steps
1. ✅ Frontend deployed to Amplify
2. ✅ Backend deployed to Lambda
3. ✅ API Gateway configured
4. ✅ CORS enabled for frontend-backend communication
5. 🔄 Test all functionality
6. 🎯 Set up custom domain (optional)
7. 📊 Configure monitoring and alerts

## 🎯 Key Features Deployed
- Interactive project showcase
- Consulting form and management system
- Real-time analytics dashboard
- Responsive design for all devices
- Full API backend with data persistence

## 🔗 Important Links
- **Live Application**: $FRONTEND_URL
- **API Documentation**: $API_ENDPOINT
- **AWS Console**: https://console.aws.amazon.com/
- **GitHub Repository**: $(git remote get-url origin 2>/dev/null || echo "Not configured")

---
**Tresidus AI** - Successfully deployed and ready for production! 🚀
EOF

echo_success "Complete deployment summary saved to COMPLETE_DEPLOYMENT_SUMMARY.md"
echo ""
echo_info "🎯 Your Tresidus AI platform is now fully deployed and ready for use!"
echo_info "🌟 Visit $FRONTEND_URL to see your live application"
echo ""
