# Example Test Run - CropGuard

This document demonstrates how to test the CropGuard application with sample data.

## 🚀 Quick Start

1. **Start the application:**
```bash
# On Windows
start.bat

# On macOS/Linux
./start.sh

# Or manually
npm run install-all
npm run dev
```

2. **Open your browser:**
Navigate to `http://localhost:3000`

## 🧪 Test Scenarios

### Test 1: Basic Disease Detection

1. **Upload Image:**
   - Click on the upload area
   - Select any crop leaf image (JPG, PNG, etc.)
   - Enter email: `test@example.com`
   - Enter location: `Test Farm, USA`

2. **Expected Results:**
   - AI prediction with disease name
   - Confidence percentage (60-100%)
   - Organic treatment recommendations
   - Prevention tips

### Test 2: Weather Risk Alerts

1. **Check Weather Banner:**
   - Look for weather alert banner at the top
   - Should show temperature, humidity, and risk level
   - Risk levels: Low, Medium, High

2. **Expected Behavior:**
   - Low risk: Green banner (if any)
   - Medium risk: Yellow banner with warning
   - High risk: Red banner with alert

### Test 3: Multi-Language Support

1. **Change Language:**
   - Use the language selector in the top-right
   - Select Spanish (Español) or French (Français)

2. **Upload Image Again:**
   - Results should be translated to selected language
   - Treatment recommendations in local language

### Test 4: Offline Functionality

1. **Disconnect Internet:**
   - Turn off WiFi or disconnect network
   - Try to access the app

2. **Expected Behavior:**
   - App should still load (cached)
   - Previous results should be available
   - Service Worker should handle offline state

## 📊 Sample Test Data

### Mock Disease Predictions

The app currently uses mock predictions. Here are examples:

**Healthy Plants:**
- Apple Healthy (85% confidence)
- Corn Healthy (92% confidence)
- Tomato Healthy (78% confidence)

**Diseased Plants:**
- Apple Scab (73% confidence)
- Corn Common Rust (81% confidence)
- Tomato Late Blight (89% confidence)

### Sample Treatment Recommendations

**Apple Scab:**
- Organic: Apply copper fungicide spray every 7-10 days during wet weather
- Prevention: Plant resistant varieties, maintain proper spacing

**Tomato Late Blight:**
- Organic: Remove infected plants immediately, apply copper fungicide
- Prevention: Avoid overhead watering, provide good air circulation

## 🔧 API Testing

### Test Backend Directly

```bash
# Health check
curl http://localhost:5000/api/health

# Weather data
curl http://localhost:5000/api/weather/New%20York

# Translation
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Your crop is healthy","targetLang":"es"}'
```

### Test Image Upload

```bash
# Using curl (replace with actual image path)
curl -X POST http://localhost:5000/api/detect-disease \
  -F "image=@test-image.jpg" \
  -F "email=test@example.com" \
  -F "location=Test Location"
```

## 📱 Mobile Testing

1. **Open on Mobile Device:**
   - Use same network as development machine
   - Navigate to `http://[your-ip]:3000`

2. **Test Mobile Features:**
   - Touch-friendly image upload
   - Responsive design
   - Mobile-optimized results display

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Kill processes on ports 3000 and 5000
   npx kill-port 3000 5000
   ```

2. **Image Upload Fails:**
   - Check file size (max 5MB)
   - Ensure image format is supported
   - Check browser console for errors

3. **Translation Not Working:**
   - LibreTranslate API might be temporarily down
   - Check internet connection
   - Try different language

4. **Weather Data Issues:**
   - Open-Meteo API might be slow
   - Check network connectivity
   - Verify location format

### Debug Commands

```bash
# Check if servers are running
curl http://localhost:5000/api/health
curl http://localhost:3000

# View server logs
# Backend logs appear in terminal
# Frontend logs in browser console (F12)
```

## 📈 Performance Testing

### Load Testing

1. **Multiple Uploads:**
   - Upload 5-10 images quickly
   - Check response times
   - Monitor server performance

2. **Concurrent Users:**
   - Open multiple browser tabs
   - Test simultaneous uploads
   - Check for race conditions

### Memory Usage

1. **Monitor Resources:**
   - Check browser memory usage
   - Monitor server CPU/memory
   - Look for memory leaks

## 🎯 Success Criteria

### ✅ Functional Tests

- [ ] Image upload works correctly
- [ ] Disease detection returns results
- [ ] Weather alerts display properly
- [ ] Translation works for multiple languages
- [ ] Offline mode functions
- [ ] Mobile responsiveness works
- [ ] All API endpoints respond

### ✅ Performance Tests

- [ ] Page loads in < 3 seconds
- [ ] Image processing completes in < 10 seconds
- [ ] Translation completes in < 5 seconds
- [ ] Weather data loads in < 2 seconds

### ✅ User Experience Tests

- [ ] Intuitive interface
- [ ] Clear error messages
- [ ] Helpful treatment recommendations
- [ ] Accessible design
- [ ] Works on different devices

## 🚀 Ready for Demo

Once all tests pass, the application is ready for:

1. **Hackathon Demo**
2. **Production Deployment**
3. **User Testing**
4. **Further Development**

---

**Note:** This is a demo application. For production use, integrate with real AI models and configure actual email services.
