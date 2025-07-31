# Tresidus AI - Agentic Company Platform

Welcome to Tresidus AI, an innovative AI agentic company specializing in cutting-edge artificial intelligence solutions and autonomous agent development.

## 🚀 Featured Projects

### [StockAgentIQ](https://stockagentiq.com)
AI-powered stock suggestion bot that analyzes market trends and provides intelligent investment recommendations.

### [Prompt Viewer](https://promptweaver.dataopslabs.com/)
Advanced prompt generator for GenAI use cases, helping users create optimized prompts for various AI applications.

### [Socials](https://socials.dataopslabs.com/)
Multi-platform social media management tool that enables content generation and direct scheduling across multiple social platforms with zero effort.

## 🏗️ Project Structure

```
project/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── consulting/    # Consulting form and dashboard
│   │   │   ├── home/          # Homepage components
│   │   │   └── layout/        # Header, footer, etc.
│   │   ├── pages/             # Main pages
│   │   └── utils/             # Utilities and data
│   ├── package.json
│   └── ...
├── backend/           # Node.js + Express backend API
│   ├── routes/
│   │   └── consulting.js      # Consulting API endpoints
│   ├── data/                  # JSON data storage
│   ├── server.js
│   ├── package.json
│   └── ...
├── start.sh          # Development environment startup script
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- AWS Account (for deployment)

### Local Development

1. **Clone and navigate to the project:**
   ```bash
   cd /path/to/project
   ```

2. **Start the development environment:**
   ```bash
   ./start.sh
   ```

   This script will:
   - Install dependencies for root, frontend, and backend
   - Start the backend server on `http://localhost:5000`
   - Start the frontend development server on `http://localhost:5173`

3. **Manual startup (alternative):**
   
   **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   
   **Start both servers:**
   ```bash
   npm run dev
   ```

### AWS Amplify Deployment

This project is configured for AWS Amplify deployment with both frontend hosting and serverless backend.

1. **Verify deployment readiness:**
   ```bash
   ./verify-deployment.sh
   ```

2. **Deploy to AWS Amplify:**
   - See [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md) for detailed instructions
   - Push to Git repository
   - Connect to AWS Amplify Console
   - Configure environment variables
   - Deploy!

3. **Quick deployment script:**
   ```bash
   ./deploy.sh
   ```

## 🌐 Access Points

- **Frontend Application:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health
- **Consulting API:** http://localhost:5000/api/consulting

## 🔧 Development

### Frontend
- Built with React 18 + TypeScript
- Styled with Tailwind CSS
- Bundled with Vite
- Hot reload enabled for development
- Consulting form and dashboard for client management

### Backend
- Node.js with Express framework
- CORS enabled for cross-origin requests
- Morgan logging middleware
- Helmet for security headers
- Environment-based configuration
- File-based JSON storage for consulting requests

## 📊 API Endpoints

### General
- `GET /` - API information and status
- `GET /health` - Health check endpoint
- `GET /api/projects` - Projects data (to be implemented)
- `GET /api/analytics` - Analytics data (to be implemented)

### Consulting API
- `GET /api/consulting` - Get all consulting requests
- `GET /api/consulting/:id` - Get specific consulting request
- `POST /api/consulting` - Create new consulting request
- `PUT /api/consulting/:id` - Update consulting request
- `DELETE /api/consulting/:id` - Delete consulting request
- `POST /api/consulting/:id/communication` - Add communication record

## 🎯 Key Features

### Core Platform
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Project Showcase:** Interactive project cards with live demo links
- **Real-time Analytics:** Dashboard with key performance metrics
- **Activity Feed:** Live updates and system notifications
- **Industry Filtering:** Filter projects by industry and status
- **Search Functionality:** Search through projects and content

### Consulting System
- **Consultation Scheduling:** Comprehensive form for client requests
- **Request Management:** Dashboard to view and manage consulting requests
- **Communication Tracking:** Record and track all client communications
- **Status Management:** Track request status from pending to completion
- **Follow-up System:** Set and track follow-up requirements
- **Data Persistence:** All data stored in JSON files for easy backup

## 📋 Consulting Features

### Client-Facing Form
- Personal and company information collection
- Project type and budget selection
- Timeline and scheduling preferences
- Detailed project description
- Communication preference settings
- Real-time form validation
- Success confirmation with auto-reset

### Management Dashboard
- View all consulting requests in organized cards
- Filter by status (pending, contacted, scheduled, completed, cancelled)
- Search by name, company, or email
- Detailed request view with all information
- Status update functionality
- Communication history tracking
- Add notes and communication records
- Follow-up reminder system

### Data Storage
- JSON-based storage in `backend/data/consulting-requests.json`
- Automatic file creation and management
- Structured data with timestamps
- Communication history per request
- Easy backup and migration

## 🔒 Environment Configuration

Copy `.env.example` to `.env` in the backend directory and configure your environment variables:

```bash
cd backend
cp .env.example .env
```

## 🚦 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

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
