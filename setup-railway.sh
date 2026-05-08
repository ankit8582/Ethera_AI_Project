#!/bin/bash
# Railway Deployment Setup Script
# This script helps prepare your project for Railway deployment

echo "🚀 Railway Deployment Setup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git not initialized. Initializing...${NC}"
    git init
    echo -e "${GREEN}✓ Git initialized${NC}"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}⚠️  .gitignore not found. Creating...${NC}"
    cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
EOF
    echo -e "${GREEN}✓ .gitignore created${NC}"
fi

# Check backend .env
echo ""
echo -e "${BLUE}Checking Backend Configuration...${NC}"
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${YELLOW}⚠️  Created backend/.env from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please update with your MongoDB URI${NC}"
    fi
fi

# Check frontend .env
echo ""
echo -e "${BLUE}Checking Frontend Configuration...${NC}"
if [ ! -f "team-task-manager/.env" ]; then
    if [ -f "team-task-manager/.env.example" ]; then
        cp team-task-manager/.env.example team-task-manager/.env
        echo -e "${YELLOW}⚠️  Created team-task-manager/.env from .env.example${NC}"
    fi
fi

# Install dependencies
echo ""
echo -e "${BLUE}Installing Dependencies...${NC}"
npm install:all
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Some dependencies may have failed${NC}"
fi

# Test local build
echo ""
echo -e "${BLUE}Testing Frontend Build...${NC}"
cd team-task-manager
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend builds successfully${NC}"
    cd ..
else
    echo -e "${YELLOW}⚠️  Frontend build failed - check errors above${NC}"
    cd ..
fi

echo ""
echo -e "${GREEN}====== Setup Complete! ======${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Update backend/.env with your MongoDB URI"
echo "2. Update team-task-manager/.env with your API URL"
echo "3. Run: git add ."
echo "4. Run: git commit -m 'Initial commit for Railway'"
echo "5. Push to GitHub"
echo "6. Follow RAILWAY_DEPLOYMENT_QUICK_START.md for Railway setup"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "- RAILWAY_DEPLOYMENT_QUICK_START.md - Fast setup guide"
echo "- RAILWAY_DEPLOYMENT_GUIDE.md - Detailed guide"
echo ""
