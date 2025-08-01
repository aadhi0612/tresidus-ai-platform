#!/bin/bash

# Tresidus AI - Git Repository Setup Script
# This script helps set up a Git repository for AWS Amplify deployment

set -e

echo "🔧 Setting up Git repository for Tresidus AI deployment..."

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

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo_error "Not in a Git repository. Please run this from the project root."
    exit 1
fi

# Check current status
echo_info "Current Git status:"
git status --short

echo ""
echo_info "🎯 Git Repository Setup Options:"
echo "1. Create a new GitHub repository (recommended)"
echo "2. Create a new GitLab repository"
echo "3. Use an existing repository URL"
echo "4. Skip Git setup (manual setup required later)"

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo_info "📱 GitHub Repository Setup"
        echo "=========================="
        echo_info "Please follow these steps:"
        echo "1. Go to https://github.com/new"
        echo "2. Create a new repository named 'tresidus-ai' (or your preferred name)"
        echo "3. Make it public or private (your choice)"
        echo "4. DO NOT initialize with README, .gitignore, or license (we already have these)"
        echo "5. Copy the repository URL (e.g., https://github.com/yourusername/tresidus-ai.git)"
        echo ""
        read -p "Enter the GitHub repository URL: " repo_url
        ;;
    2)
        echo_info "🦊 GitLab Repository Setup"
        echo "=========================="
        echo_info "Please follow these steps:"
        echo "1. Go to https://gitlab.com/projects/new"
        echo "2. Create a new project named 'tresidus-ai'"
        echo "3. Make it public or private (your choice)"
        echo "4. DO NOT initialize with README"
        echo "5. Copy the repository URL (e.g., https://gitlab.com/yourusername/tresidus-ai.git)"
        echo ""
        read -p "Enter the GitLab repository URL: " repo_url
        ;;
    3)
        echo_info "🔗 Existing Repository"
        echo "====================="
        read -p "Enter the repository URL: " repo_url
        ;;
    4)
        echo_warning "Skipping Git setup. You'll need to configure this manually later."
        echo_info "To set up later, run:"
        echo_info "git remote add origin <your-repo-url>"
        echo_info "git push -u origin main"
        exit 0
        ;;
    *)
        echo_error "Invalid option selected."
        exit 1
        ;;
esac

# Validate URL format
if [[ ! "$repo_url" =~ ^https?:// ]] && [[ ! "$repo_url" =~ ^git@ ]]; then
    echo_error "Invalid repository URL format. Please use HTTPS or SSH format."
    exit 1
fi

# Add remote origin
echo_info "Adding remote origin..."
if git remote get-url origin > /dev/null 2>&1; then
    echo_warning "Remote 'origin' already exists. Removing and re-adding..."
    git remote remove origin
fi

git remote add origin "$repo_url"
echo_success "Added remote origin: $repo_url"

# Prepare files for commit
echo_info "Preparing files for initial commit..."

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/frontend/dist/
/backend/dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# AWS
.aws/
amplify/
.amplify/

# Deployment artifacts
*.zip
trust-policy.json

# Temporary files
tmp/
temp/
EOF
    echo_success "Created .gitignore file"
fi

# Add all files
echo_info "Adding files to Git..."
git add .

# Create initial commit
echo_info "Creating initial commit..."
git commit -m "Initial commit: Tresidus AI Agentic Company Platform

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express API
- Features: Project showcase, consulting system, analytics
- Ready for AWS Amplify deployment" || echo_warning "No changes to commit"

# Push to remote
echo_info "Pushing to remote repository..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo_success "🎉 Successfully pushed to remote repository!"
    echo_info "Repository URL: $repo_url"
    echo_info "Branch: main"
    echo ""
    echo_success "✅ Git repository is now ready for AWS Amplify deployment!"
    echo_info "You can now run: ./deploy-complete.sh"
else
    echo_error "Failed to push to remote repository."
    echo_info "This might be due to:"
    echo_info "1. Authentication issues (check your Git credentials)"
    echo_info "2. Repository doesn't exist or is not accessible"
    echo_info "3. Network connectivity issues"
    echo ""
    echo_info "Please resolve the issue and try again, or push manually:"
    echo_info "git push -u origin main"
fi

echo ""
echo_info "📋 Next Steps:"
echo "1. Verify your code is visible in the remote repository"
echo "2. Run the complete deployment: ./deploy-complete.sh"
echo "3. Monitor the deployment progress"
echo ""
