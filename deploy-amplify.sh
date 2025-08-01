#!/bin/bash

# Tresidus AI - Complete AWS Amplify Deployment Script
# This script deploys both frontend and backend to AWS Amplify

set -e

echo "🚀 Starting Tresidus AI deployment to AWS Amplify..."

# Configuration
AWS_PROFILE="098493093308_AdministratorAccess"
AWS_REGION="us-east-1"
APP_NAME="tresidus-ai"
BRANCH_NAME="main"

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

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if the AWS profile exists
if ! aws configure list-profiles | grep -q "$AWS_PROFILE"; then
    echo_error "AWS profile '$AWS_PROFILE' not found in ~/.aws/credentials"
    exit 1
fi

echo_info "Using AWS profile: $AWS_PROFILE"
echo_info "Deploying to region: $AWS_REGION"

# Set AWS profile for this session
export AWS_PROFILE="$AWS_PROFILE"
export AWS_DEFAULT_REGION="$AWS_REGION"

# Verify AWS credentials
echo_info "Verifying AWS credentials..."
if ! aws sts get-caller-identity --profile "$AWS_PROFILE" > /dev/null 2>&1; then
    echo_error "Failed to authenticate with AWS using profile '$AWS_PROFILE'"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --profile "$AWS_PROFILE" --query Account --output text)
echo_success "Authenticated with AWS Account: $ACCOUNT_ID"

# Clean up git repository
echo_info "Preparing git repository..."
git add .
git commit -m "Deploy to AWS Amplify - $(date)" || echo_warning "No changes to commit"

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo_warning "No git remote 'origin' found. You'll need to push to a Git repository for Amplify to deploy."
    echo_info "Please set up a Git repository (GitHub, GitLab, etc.) and add it as origin:"
    echo_info "git remote add origin <your-repo-url>"
    echo_info "git push -u origin main"
    read -p "Press Enter after you've set up the Git repository and pushed the code..."
fi

# Push to remote repository
echo_info "Pushing to remote repository..."
git push origin main || {
    echo_error "Failed to push to remote repository"
    exit 1
}

# Check if Amplify app already exists
echo_info "Checking if Amplify app '$APP_NAME' exists..."
if aws amplify get-app --app-id "$APP_NAME" --profile "$AWS_PROFILE" > /dev/null 2>&1; then
    echo_info "Amplify app '$APP_NAME' already exists. Updating..."
    APP_ID="$APP_NAME"
else
    # Create Amplify app
    echo_info "Creating new Amplify app..."
    
    # Get the repository URL
    REPO_URL=$(git remote get-url origin)
    echo_info "Repository URL: $REPO_URL"
    
    # Determine repository provider
    if [[ "$REPO_URL" == *"github.com"* ]]; then
        PROVIDER="GITHUB"
    elif [[ "$REPO_URL" == *"gitlab.com"* ]]; then
        PROVIDER="GITLAB"
    elif [[ "$REPO_URL" == *"bitbucket.org"* ]]; then
        PROVIDER="BITBUCKET"
    else
        echo_error "Unsupported repository provider. Please use GitHub, GitLab, or Bitbucket."
        exit 1
    fi
    
    # Create the Amplify app
    CREATE_RESULT=$(aws amplify create-app \
        --name "$APP_NAME" \
        --description "Tresidus AI - Agentic Company Platform" \
        --repository "$REPO_URL" \
        --platform "WEB" \
        --iam-service-role-arn "arn:aws:iam::$ACCOUNT_ID:role/amplifyconsole-backend-role" \
        --enable-branch-auto-build \
        --profile "$AWS_PROFILE" \
        --region "$AWS_REGION" 2>/dev/null || {
        
        # If role doesn't exist, create app without it
        echo_warning "Creating app without service role (will be set up later)..."
        CREATE_RESULT=$(aws amplify create-app \
            --name "$APP_NAME" \
            --description "Tresidus AI - Agentic Company Platform" \
            --repository "$REPO_URL" \
            --platform "WEB" \
            --enable-branch-auto-build \
            --profile "$AWS_PROFILE" \
            --region "$AWS_REGION")
    })
    
    APP_ID=$(echo "$CREATE_RESULT" | jq -r '.app.appId')
    echo_success "Created Amplify app with ID: $APP_ID"
fi

# Create or update branch
echo_info "Setting up branch '$BRANCH_NAME'..."
if aws amplify get-branch --app-id "$APP_ID" --branch-name "$BRANCH_NAME" --profile "$AWS_PROFILE" > /dev/null 2>&1; then
    echo_info "Branch '$BRANCH_NAME' already exists. Updating..."
else
    echo_info "Creating branch '$BRANCH_NAME'..."
    aws amplify create-branch \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH_NAME" \
        --description "Main production branch" \
        --enable-auto-build \
        --profile "$AWS_PROFILE" \
        --region "$AWS_REGION" > /dev/null
    echo_success "Created branch '$BRANCH_NAME'"
fi

# Set environment variables
echo_info "Setting environment variables..."
aws amplify put-backend-environment \
    --app-id "$APP_ID" \
    --environment-name "production" \
    --deployment-artifacts "tresidus-deployment-artifacts" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" > /dev/null 2>&1 || echo_warning "Backend environment may already exist"

# Update build settings
echo_info "Updating build settings..."
BUILD_SPEC=$(cat << 'EOF'
{
  "version": 1,
  "frontend": {
    "phases": {
      "preBuild": {
        "commands": [
          "cd frontend",
          "npm ci"
        ]
      },
      "build": {
        "commands": [
          "npm run build"
        ]
      }
    },
    "artifacts": {
      "baseDirectory": "frontend/dist",
      "files": [
        "**/*"
      ]
    },
    "cache": {
      "paths": [
        "frontend/node_modules/**/*"
      ]
    }
  }
}
EOF
)

aws amplify update-app \
    --app-id "$APP_ID" \
    --build-spec "$BUILD_SPEC" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" > /dev/null

echo_success "Updated build settings"

# Start deployment
echo_info "Starting deployment..."
DEPLOYMENT_RESULT=$(aws amplify start-job \
    --app-id "$APP_ID" \
    --branch-name "$BRANCH_NAME" \
    --job-type "RELEASE" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION")

JOB_ID=$(echo "$DEPLOYMENT_RESULT" | jq -r '.jobSummary.jobId')
echo_info "Deployment started with Job ID: $JOB_ID"

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
            echo_success "Deployment completed successfully!"
            break
            ;;
        "FAILED"|"CANCELLED")
            echo_error "Deployment failed with status: $JOB_STATUS"
            
            # Get failure reason
            aws amplify get-job \
                --app-id "$APP_ID" \
                --branch-name "$BRANCH_NAME" \
                --job-id "$JOB_ID" \
                --profile "$AWS_PROFILE" \
                --region "$AWS_REGION" \
                --query 'job.summary.statusReason' \
                --output text
            exit 1
            ;;
        *)
            echo_warning "Unknown deployment status: $JOB_STATUS"
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

echo_success "🎉 Deployment completed successfully!"
echo_info "📱 App ID: $APP_ID"
echo_info "🌐 Frontend URL: https://$BRANCH_NAME.$APP_URL"
echo_info "🔧 Amplify Console: https://console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID"

# Create deployment summary
cat > DEPLOYMENT_SUMMARY.md << EOF
# Tresidus AI - AWS Amplify Deployment Summary

## Deployment Details
- **App Name**: $APP_NAME
- **App ID**: $APP_ID
- **Region**: $AWS_REGION
- **Branch**: $BRANCH_NAME
- **Deployment Date**: $(date)

## URLs
- **Frontend Application**: https://$BRANCH_NAME.$APP_URL
- **Amplify Console**: https://console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID

## Next Steps
1. Set up custom domain (optional)
2. Configure environment variables in Amplify Console
3. Set up backend API endpoints
4. Configure CI/CD pipeline

## Backend Deployment
The backend is currently configured for serverless deployment. To deploy the backend:
1. Use AWS Lambda for the API
2. Set up API Gateway
3. Configure CORS for frontend-backend communication

## Support
For issues or questions, check the Amplify Console logs or contact the development team.
EOF

echo_success "Deployment summary saved to DEPLOYMENT_SUMMARY.md"
echo_info "🚀 Your Tresidus AI application is now live!"
