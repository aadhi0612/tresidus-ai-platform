# Tresidus AI - Agentic Company Platform

Welcome to Tresidus AI, an innovative AI agentic company specializing in cutting-edge artificial intelligence solutions and autonomous agent development.

## 🌟 Live Application
- **Frontend**: [Deployed on AWS Amplify](https://main.amplify.app)
- **Backend API**: [https://zjgsssms17.execute-api.us-east-1.amazonaws.com/prod](https://zjgsssms17.execute-api.us-east-1.amazonaws.com/prod)

## 🚀 Featured Projects

### [StockAgentIQ](https://stockagentiq.com)
AI-powered stock suggestion bot that analyzes market trends and provides intelligent investment recommendations.

### [Prompt Viewer](https://promptweaver.dataopslabs.com/)
Advanced prompt generator for GenAI use cases, helping users create optimized prompts for various AI applications.

### [Socials](https://socials.dataopslabs.com/)
Multi-platform social media management tool that enables content generation and direct scheduling across multiple social platforms with zero effort.

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: AWS Amplify

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js
- **Deployment**: AWS Lambda + API Gateway
- **Storage**: JSON file-based (easily upgradeable to database)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- AWS Account (for deployment)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aadhi0612/tresidus-ai-platform.git
   cd tresidus-ai-platform
   ```

2. **Start the development environment:**
   ```bash
   ./start.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🌐 API Endpoints

### General
- `GET /` - API information and status
- `GET /health` - Health check endpoint

### Consulting API
- `GET /api/consulting` - Get all consulting requests
- `GET /api/consulting/:id` - Get specific consulting request
- `POST /api/consulting` - Create new consulting request
- `PUT /api/consulting/:id` - Update consulting request
- `DELETE /api/consulting/:id` - Delete consulting request

### Projects & Analytics
- `GET /api/projects` - Get projects data
- `GET /api/analytics` - Get analytics data

## 🎯 Key Features

### Core Platform
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Project Showcase**: Interactive project cards with live demo links
- **Real-time Analytics**: Dashboard with key performance metrics
- **Activity Feed**: Live updates and system notifications

### Consulting System
- **Consultation Scheduling**: Comprehensive form for client requests
- **Request Management**: Dashboard to view and manage consulting requests
- **Communication Tracking**: Record and track all client communications
- **Status Management**: Track request status from pending to completion

## 🚦 Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `./start.sh` - Development environment startup script

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## 🚀 Deployment

### AWS Amplify (Frontend)
The frontend is automatically deployed to AWS Amplify on every push to the main branch.

### AWS Lambda (Backend)
The backend is deployed as AWS Lambda functions with API Gateway integration.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 External Links

- [StockAgentIQ Platform](https://stockagentiq.com)
- [Prompt Weaver Tool](https://promptweaver.dataopslabs.com/)
- [Socials Management Platform](https://socials.dataopslabs.com/)

---

**Tresidus AI** - Pioneering the future of autonomous AI agents and intelligent automation solutions.
