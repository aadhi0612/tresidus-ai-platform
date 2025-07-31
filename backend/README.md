# Tresidus AI Backend

Backend API server for the Tresidus AI platform.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

```bash
npm install
```

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration values.

### Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📊 API Endpoints

### Base Routes
- `GET /` - API information and status
- `GET /health` - Health check endpoint

### API Routes
- `GET /api/projects` - Get projects data
- `GET /api/analytics` - Get analytics data

## 🔧 Tech Stack

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management

## 📝 Development

The server runs on port 5000 by default and includes:
- Hot reloading with nodemon
- Request logging
- Error handling middleware
- Security headers
- CORS support

## 🔒 Security

- Helmet.js for security headers
- CORS configuration
- Environment variable protection
- Error message sanitization in production
