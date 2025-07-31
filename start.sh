#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a directory exists
dir_exists() {
    [ -d "$1" ]
}

# Function to start backend
start_backend() {
    print_status "Starting backend..."
    
    if dir_exists "./backend"; then
        cd backend
        if [ -f "package.json" ]; then
            # Check if node_modules exists
            if [ ! -d "node_modules" ]; then
                print_status "Installing backend dependencies..."
                npm install
            fi
            
            print_status "Starting Node.js backend server..."
            npm run dev &
            BACKEND_PID=$!
            print_success "Backend started with PID: $BACKEND_PID"
        else
            print_warning "Backend directory found but no package.json. Skipping backend startup."
        fi
        cd ..
    else
        print_warning "No backend directory found. Skipping backend startup."
    fi
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend..."
    
    if dir_exists "./frontend"; then
        cd frontend
        if [ -f "package.json" ]; then
            # Check if node_modules exists
            if [ ! -d "node_modules" ]; then
                print_status "Installing frontend dependencies..."
                npm install
            fi
            
            print_status "Starting frontend development server..."
            npm run dev &
            FRONTEND_PID=$!
            print_success "Frontend started with PID: $FRONTEND_PID"
        else
            print_error "Frontend directory found but no package.json!"
            exit 1
        fi
        cd ..
    else
        print_error "No frontend directory found!"
        exit 1
    fi
}

# Function to cleanup processes on exit
cleanup() {
    print_status "Shutting down services..."
    # Kill all background jobs
    jobs -p | xargs -r kill
    print_success "All services stopped."
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Main execution
print_status "🚀 Starting Tresidus AI Development Environment..."
print_status "Current directory: $(pwd)"

# Check for required tools
if ! command_exists npm; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install root dependencies if package.json exists
if [ -f "package.json" ]; then
    if [ ! -d "node_modules" ]; then
        print_status "Installing root dependencies..."
        npm install
    fi
fi

# Start backend
start_backend

# Wait a moment for backend to start
sleep 3

# Start frontend
start_frontend

print_success "🎉 Development environment started successfully!"
print_status "🌐 Frontend: http://localhost:5173"
print_status "🔧 Backend API: http://localhost:5000"
print_status "📊 Health Check: http://localhost:5000/health"
print_status ""
print_status "📝 Featured Projects:"
print_status "   • StockAgentIQ: https://stockagentiq.com"
print_status "   • Prompt Viewer: https://promptweaver.dataopslabs.com/"
print_status "   • Socials: https://socials.dataopslabs.com/"
print_status ""
print_status "Press Ctrl+C to stop all services"

# Wait for all background processes
wait
