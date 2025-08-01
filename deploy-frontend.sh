#!/bin/bash

# Tresidus AI Frontend Deployment Script
# This script builds and deploys the React frontend to S3 + CloudFront

set -e

echo "🚀 Starting Tresidus AI Frontend Deployment..."

# Configuration
S3_BUCKET="tresidus-ai-frontend-1753989038"
CLOUDFRONT_DISTRIBUTION_ID="E3EZ112TK1SG3Z"
AWS_PROFILE="tresidus"
AWS_REGION="us-east-1"

# Build the frontend
echo "📦 Building React application..."
cd frontend
npm run build
cd ..

# Upload to S3
echo "☁️ Uploading to S3..."
aws s3 sync frontend/dist/ s3://$S3_BUCKET/ --profile $AWS_PROFILE --region $AWS_REGION --delete

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --profile $AWS_PROFILE

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your application is available at:"
echo "   S3 Website: http://$S3_BUCKET.s3-website-us-east-1.amazonaws.com/"
echo "   CloudFront: https://dnphbmv0rvq5k.cloudfront.net/"
echo ""
echo "📡 Backend API: https://sixlb0aatc.execute-api.us-east-1.amazonaws.com/prod"
echo ""
echo "Note: CloudFront distribution may take 10-15 minutes to fully deploy."
