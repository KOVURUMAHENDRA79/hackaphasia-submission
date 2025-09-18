# Deployment Guide

This guide covers deploying CropGuard to production environments.

## 🌐 Frontend Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd client
vercel --prod
```

3. **Configure environment variables:**
- Set `NEXT_PUBLIC_API_URL` to your backend URL

### Netlify

1. **Build the project:**
```bash
cd client
npm run build
```

2. **Deploy:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=client/out
```

## 🖥️ Backend Deployment

### Render (Recommended)

1. **Create a new Web Service**
2. **Connect your GitHub repository**
3. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`
   - Port: `5000`

4. **Environment Variables:**
   - `NODE_ENV=production`
   - `PORT=5000`

### Heroku

1. **Install Heroku CLI**
2. **Create app:**
```bash
cd server
heroku create your-app-name
```

3. **Deploy:**
```bash
git subtree push --prefix server heroku main
```

4. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
```

## 🔧 Environment Configuration

### Backend Environment Variables

Create `server/.env`:
```env
NODE_ENV=production
PORT=5000
```

### Frontend Environment Variables

Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## 📊 Database Setup

The app uses SQLite which is automatically created on first run. For production:

1. **SQLite files are created automatically**
2. **No additional database setup required**
3. **Data persists in the `crop_disease.db` file**

## 🔒 Security Considerations

1. **Enable CORS for your frontend domain**
2. **Set up rate limiting for API endpoints**
3. **Validate file uploads**
4. **Use HTTPS in production**

## 📈 Monitoring

### Health Checks

Monitor these endpoints:
- `GET /api/health` - Backend health
- Frontend root URL - Frontend health

### Logs

- Backend logs: Check your hosting platform's log viewer
- Frontend logs: Browser console and network tab

## 🚀 Performance Optimization

### Frontend
- Images are optimized automatically by Next.js
- Service Workers cache static assets
- Tailwind CSS is purged in production

### Backend
- SQLite provides fast local database access
- Image processing uses Sharp for optimization
- API responses are cached where appropriate

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd client && npm install && npm run build
      - run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd server && npm install
      - run: git subtree push --prefix server heroku main
```

## 🧪 Testing Deployment

### Pre-deployment Checklist

- [ ] Frontend builds without errors
- [ ] Backend starts successfully
- [ ] All API endpoints respond correctly
- [ ] Image upload works
- [ ] Translation service works
- [ ] Weather API integration works
- [ ] Database operations work
- [ ] Service Worker registers correctly

### Post-deployment Testing

1. **Test all major features:**
   - Image upload and disease detection
   - Weather alerts
   - Translation functionality
   - Offline mode

2. **Performance testing:**
   - Page load times
   - API response times
   - Image processing speed

3. **Cross-browser testing:**
   - Chrome, Firefox, Safari
   - Mobile browsers
   - Different screen sizes

## 📱 PWA Configuration

The app is configured as a Progressive Web App:

1. **Manifest file** (`/manifest.json`)
2. **Service Worker** (`/sw.js`)
3. **Offline functionality**
4. **Installable on mobile devices**

## 🔧 Troubleshooting Deployment

### Common Issues

1. **Build failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Runtime errors:**
   - Verify environment variables
   - Check API endpoint URLs
   - Monitor server logs

3. **Database issues:**
   - Ensure SQLite file permissions
   - Check disk space
   - Verify database file location

### Debug Commands

```bash
# Check backend health
curl https://your-backend-url.com/api/health

# Test image upload
curl -X POST -F "image=@test-image.jpg" https://your-backend-url.com/api/detect-disease

# Check frontend build
cd client && npm run build && npm run start
```

## 📞 Support

If you encounter deployment issues:

1. Check the logs on your hosting platform
2. Verify all environment variables are set
3. Test locally first
4. Check API service availability
5. Contact the development team

---

Happy deploying! 🚀
