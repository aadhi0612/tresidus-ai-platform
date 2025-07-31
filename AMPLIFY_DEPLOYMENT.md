# AWS Amplify Deployment Guide for Tresidus AI

This guide will help you deploy your Tresidus AI platform to AWS Amplify with both frontend hosting and backend API.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install and configure AWS CLI
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Deployment Options

### Option 1: Using AWS Amplify Console (Recommended)

1. **Push to Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Tresidus AI Platform"
   git branch -M main
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

2. **Connect to Amplify Console**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your Git repository
   - Select the repository and branch

3. **Configure Build Settings**:
   - Amplify will auto-detect the `amplify.yml` file
   - The build will use the configuration we've set up
   - Frontend will be built from the `frontend/` directory
   - Backend API will be deployed as Lambda functions

4. **Environment Variables**:
   Set these in Amplify Console → App Settings → Environment Variables:
   ```
   NODE_ENV=production
   VITE_API_URL=https://your-api-gateway-url.amazonaws.com/prod
   VITE_APP_NAME=Tresidus AI
   VITE_ENVIRONMENT=production
   ```

### Option 2: Using Amplify CLI

1. **Install Amplify CLI**:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Configure Amplify**:
   ```bash
   amplify configure
   ```

3. **Initialize Amplify Project**:
   ```bash
   amplify init
   ```
   - Project name: `tresidus-ai`
   - Environment: `dev` or `prod`
   - Default editor: Your preferred editor
   - App type: `javascript`
   - Framework: `react`
   - Source directory: `frontend/src`
   - Build directory: `frontend/dist`
   - Build command: `npm run build`
   - Start command: `npm run dev`

4. **Add Hosting**:
   ```bash
   amplify add hosting
   ```
   - Select: `Amazon CloudFront and S3`

5. **Add API**:
   ```bash
   amplify add api
   ```
   - Select: `REST`
   - API name: `tresidusapi`
   - Path: `/api`
   - Lambda source: `Create a new Lambda function`
   - Function name: `tresidusBackend`
   - Template: `Serverless ExpressJS function`

6. **Deploy**:
   ```bash
   amplify publish
   ```

## Project Structure for Amplify

```
project/
├── amplify.yml                 # Amplify build configuration
├── amplify-build.yml          # Alternative build config
├── package.json               # Root package.json for monorepo
├── deploy.sh                  # Deployment script
├── frontend/                  # React frontend
│   ├── src/
│   ├── package.json
│   ├── .env.production
│   └── dist/                  # Build output
├── backend/                   # Express.js backend
│   ├── server.js             # Main server file
│   ├── lambda.js             # Lambda handler
│   ├── template.yaml         # SAM template
│   ├── package.json
│   └── routes/
└── README.md
```

## Build Configuration

The `amplify.yml` file is configured to:
- Build the React frontend from the `frontend/` directory
- Deploy the backend as serverless functions
- Handle both applications in a monorepo structure

## Environment Variables

### Frontend (.env.production)
```
VITE_API_URL=https://your-api-gateway-url.amazonaws.com/prod
VITE_APP_NAME=Tresidus AI
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

### Backend
```
NODE_ENV=production
PORT=5000
```

## Custom Domain (Optional)

1. In Amplify Console, go to "Domain management"
2. Add your custom domain
3. Configure DNS settings as instructed
4. SSL certificate will be automatically provisioned

## Monitoring and Logs

- **Frontend**: Check Amplify Console → Monitoring
- **Backend**: Check CloudWatch Logs for Lambda functions
- **API Gateway**: Monitor API calls and errors

## Troubleshooting

### Build Failures
- Check the build logs in Amplify Console
- Ensure all dependencies are listed in package.json
- Verify environment variables are set correctly

### API Issues
- Check Lambda function logs in CloudWatch
- Verify CORS configuration
- Test API endpoints directly

### Frontend Issues
- Check browser console for errors
- Verify API URL is correct in environment variables
- Test locally first with `npm run dev`

## Cost Optimization

- **Frontend**: Amplify hosting is pay-per-use
- **Backend**: Lambda functions are pay-per-request
- **Storage**: S3 storage for static assets
- **CDN**: CloudFront for global content delivery

## Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Configure properly for your domain
3. **API Security**: Implement authentication if needed
4. **HTTPS**: Always use HTTPS in production

## Support

For issues with deployment:
1. Check AWS Amplify documentation
2. Review CloudWatch logs
3. Test locally first
4. Check this project's README.md for local development

---

**Next Steps**: After deployment, update the API URL in your frontend environment variables and test all functionality.
