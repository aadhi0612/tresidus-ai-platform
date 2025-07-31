#!/bin/bash

# Tresidus AI - Deployment Verification Script

echo "🔍 Verifying Tresidus AI deployment readiness..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Check if required files exist
echo "📁 Checking required files..."

required_files=(
    "package.json"
    "amplify.yml"
    "frontend/package.json"
    "backend/package.json"
    "backend/server.js"
    "backend/lambda.js"
    "frontend/.env.production"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file (missing)${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check if dependencies are installed
echo ""
echo "📦 Checking dependencies..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Root dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Root dependencies not installed${NC}"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Frontend dependencies not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Backend dependencies not installed${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Test build process
echo ""
echo "🔨 Testing build process..."

cd frontend
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend builds successfully${NC}"
    if [ -d "dist" ]; then
        echo -e "${GREEN}✅ Frontend dist directory created${NC}"
    else
        echo -e "${RED}❌ Frontend dist directory not found${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    ERRORS=$((ERRORS + 1))
fi

cd ..

# Check backend structure
echo ""
echo "🔧 Checking backend structure..."

if grep -q "module.exports = app" backend/server.js; then
    echo -e "${GREEN}✅ Backend exports app for serverless${NC}"
else
    echo -e "${RED}❌ Backend doesn't export app${NC}"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "serverless-http" backend/package.json; then
    echo -e "${GREEN}✅ Serverless-http dependency found${NC}"
else
    echo -e "${RED}❌ Serverless-http dependency missing${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Summary
echo ""
echo "📊 Verification Summary:"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your project is ready for AWS Amplify deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to a Git repository"
    echo "2. Connect to AWS Amplify Console"
    echo "3. Configure environment variables"
    echo "4. Deploy!"
else
    echo -e "${RED}❌ Found $ERRORS issues that need to be fixed before deployment.${NC}"
    echo ""
    echo "Please fix the issues above and run this script again."
fi
