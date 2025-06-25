#!/bin/bash

# MediaGrab Deployment Script
# This script helps you deploy MediaGrab with various options

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="mediagrab"
FRONTEND_PORT=3000
BACKEND_PORT=8000
NGINX_PORT=80

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."

    local missing_deps=()

    if ! command_exists node; then
        missing_deps+=("Node.js 18+")
    fi

    if ! command_exists npm; then
        missing_deps+=("npm")
    fi

    if ! command_exists python3; then
        missing_deps+=("Python 3.8+")
    fi

    if ! command_exists pip3; then
        missing_deps+=("pip3")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_info "Please install the missing dependencies and try again."
        exit 1
    fi

    log_success "All requirements satisfied!"
}

# Install Python dependencies
install_python_deps() {
    log_info "Installing Python dependencies..."

    if [ -f "requirements.txt" ]; then
        pip3 install -r requirements.txt
        log_success "Python dependencies installed!"
    else
        log_error "requirements.txt not found!"
        exit 1
    fi
}

# Install Node.js dependencies
install_node_deps() {
    log_info "Installing Node.js dependencies..."

    if [ -d "frontend" ]; then
        cd frontend
        npm install
        cd ..
        log_success "Node.js dependencies installed!"
    else
        log_error "Frontend directory not found!"
        exit 1
    fi
}

# Build frontend
build_frontend() {
    log_info "Building frontend..."

    cd frontend
    npm run build
    cd ..

    log_success "Frontend built successfully!"
}

# Start development servers
start_dev() {
    log_info "Starting development servers..."

    # Create downloads directory
    mkdir -p downloads

    # Start backend in background
    log_info "Starting Python backend on port $BACKEND_PORT..."
    python3 main.py &
    BACKEND_PID=$!

    # Wait for backend to start
    sleep 5

    # Start frontend in background
    log_info "Starting Next.js frontend on port $FRONTEND_PORT..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..

    log_success "Development servers started!"
    log_info "Frontend: http://localhost:$FRONTEND_PORT"
    log_info "Backend API: http://localhost:$BACKEND_PORT"
    log_info "API Docs: http://localhost:$BACKEND_PORT/docs"

    # Trap to kill processes on exit
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM EXIT

    # Wait for processes
    wait
}

# Start production servers
start_prod() {
    log_info "Starting production servers..."

    # Create downloads directory
    mkdir -p downloads

    # Build frontend first
    build_frontend

    # Start backend
    log_info "Starting Python backend in production mode..."
    python3 main.py &
    BACKEND_PID=$!

    # Start frontend
    log_info "Starting Next.js frontend in production mode..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..

    log_success "Production servers started!"
    log_info "Application: http://localhost:$FRONTEND_PORT"

    # Trap to kill processes on exit
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM EXIT

    # Wait for processes
    wait
}

# Docker deployment
deploy_docker() {
    log_info "Deploying with Docker..."

    if ! command_exists docker; then
        log_error "Docker not found! Please install Docker first."
        exit 1
    fi

    if ! command_exists docker-compose; then
        log_error "Docker Compose not found! Please install Docker Compose first."
        exit 1
    fi

    # Build and start containers
    docker-compose up --build -d

    log_success "Docker deployment started!"
    log_info "Application: http://localhost:$NGINX_PORT"
    log_info "Backend API: http://localhost:$BACKEND_PORT"
    log_info "Frontend: http://localhost:$FRONTEND_PORT"

    # Show container status
    docker-compose ps
}

# Stop Docker deployment
stop_docker() {
    log_info "Stopping Docker deployment..."

    docker-compose down

    log_success "Docker deployment stopped!"
}

# Clean up
cleanup() {
    log_info "Cleaning up..."

    # Remove node_modules
    if [ -d "frontend/node_modules" ]; then
        rm -rf frontend/node_modules
        log_info "Removed frontend/node_modules"
    fi

    # Remove build artifacts
    if [ -d "frontend/.next" ]; then
        rm -rf frontend/.next
        log_info "Removed frontend/.next"
    fi

    # Remove Python cache
    find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true

    # Remove downloads (optional)
    read -p "Remove downloads directory? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf downloads
        log_info "Removed downloads directory"
    fi

    log_success "Cleanup completed!"
}

# Health check
health_check() {
    log_info "Performing health check..."

    # Check backend
    if curl -f http://localhost:$BACKEND_PORT/health >/dev/null 2>&1; then
        log_success "Backend is healthy"
    else
        log_error "Backend is not responding"
    fi

    # Check frontend
    if curl -f http://localhost:$FRONTEND_PORT >/dev/null 2>&1; then
        log_success "Frontend is healthy"
    else
        log_error "Frontend is not responding"
    fi
}

# Show logs
show_logs() {
    if command_exists docker-compose; then
        log_info "Showing Docker logs..."
        docker-compose logs -f
    else
        log_warning "Docker Compose not available. Check individual service logs."
    fi
}

# Update application
update() {
    log_info "Updating MediaGrab..."

    # Pull latest changes
    if [ -d ".git" ]; then
        git pull origin main
        log_success "Code updated from Git"
    else
        log_warning "Not a Git repository. Please update manually."
    fi

    # Update dependencies
    install_python_deps
    install_node_deps

    # Rebuild if using Docker
    if command_exists docker-compose && [ -f "docker-compose.yml" ]; then
        docker-compose build --no-cache
        log_success "Docker images rebuilt"
    fi

    log_success "Update completed!"
}

# Show usage
show_usage() {
    echo "MediaGrab Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     Install all dependencies"
    echo "  dev         Start development servers"
    echo "  prod        Start production servers"
    echo "  docker      Deploy with Docker"
    echo "  stop        Stop Docker deployment"
    echo "  build       Build frontend only"
    echo "  clean       Clean up build artifacts"
    echo "  health      Check service health"
    echo "  logs        Show application logs"
    echo "  update      Update application"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 dev        # Start in development mode"
    echo "  $0 docker     # Deploy with Docker"
    echo ""
}

# Main script logic
main() {
    case "${1:-help}" in
        install)
            check_requirements
            install_python_deps
            install_node_deps
            log_success "Installation completed!"
            ;;
        dev)
            check_requirements
            start_dev
            ;;
        prod)
            check_requirements
            start_prod
            ;;
        docker)
            deploy_docker
            ;;
        stop)
            stop_docker
            ;;
        build)
            build_frontend
            ;;
        clean)
            cleanup
            ;;
        health)
            health_check
            ;;
        logs)
            show_logs
            ;;
        update)
            update
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            log_error "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
