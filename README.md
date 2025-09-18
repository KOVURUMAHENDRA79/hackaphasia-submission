# CropGuard - AI-Powered Crop Disease Detection

An AI-powered platform for early crop disease detection and localized guidance, empowering smallholder farmers with sustainable solutions to boost yields, reduce chemical use, and strengthen food security.

## 🌱 Features

- **AI Disease Detection**: Upload crop leaf images for instant disease identification
- **Organic Treatment Recommendations**: Get sustainable, chemical-free treatment options
- **Weather Risk Alerts**: Real-time weather monitoring for disease risk prediction
- **Multi-Language Support**: Results available in 16+ languages via LibreTranslate
- **Offline Mode**: Service Workers and IndexedDB for low-connectivity areas
- **Email Notifications**: Automated alerts via Nodemailer
- **Mobile-First Design**: Responsive UI built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd crop-disease-detector
npm run install-all
```

2. **Start the development servers:**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend on `http://localhost:3000`

3. **Open your browser:**
Navigate to `http://localhost:3000` to see the application.

## 🏗️ Project Structure

```
crop-disease-detector/
├── server/                 # Backend (Node.js/Express)
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── uploads/           # Image upload directory
├── client/                # Frontend (Next.js/React)
│   ├── app/               # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── globals.css    # Global styles
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Home page
│   ├── public/            # Static assets
│   │   ├── sw.js         # Service Worker
│   │   └── manifest.json # PWA manifest
│   └── package.json       # Frontend dependencies
└── package.json           # Root package.json
```

## 🔧 API Endpoints

### Backend (`http://localhost:5000`)

- `POST /api/detect-disease` - Upload image for disease detection
- `GET /api/weather/:location` - Get weather data and risk alerts
- `POST /api/translate` - Translate text using LibreTranslate
- `GET /api/disease-history/:email` - Get user's detection history
- `GET /api/health` - Health check endpoint

## 🌐 Free APIs Used

- **LibreTranslate**: Free translation service (no API key required)
- **Open-Meteo**: Free weather data API (no API key required)
- **TensorFlow.js**: Open-source ML library for disease detection

## 📱 Offline Functionality

The app includes Service Workers and IndexedDB for offline functionality:

- Caches last detection results
- Stores treatment recommendations
- Works in low-connectivity areas
- Progressive Web App (PWA) support

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. **Build the frontend:**
```bash
cd client
npm run build
```

2. **Deploy to Vercel:**
```bash
npx vercel --prod
```

3. **Deploy to Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=client/out
```

### Backend (Render/Heroku)

1. **Prepare for deployment:**
```bash
cd server
npm install
```

2. **Deploy to Render:**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Set environment: `Node`

3. **Deploy to Heroku:**
```bash
cd server
heroku create your-app-name
git subtree push --prefix server heroku main
```

## 🧪 Testing

### Test Disease Detection

1. Upload a crop leaf image
2. Enter your email address
3. Click "Detect Disease"
4. View AI prediction and treatment recommendations

### Test Weather Alerts

1. The app automatically fetches weather data
2. Risk alerts appear based on temperature and humidity
3. High-risk conditions trigger warning banners

### Test Translation

1. Select a different language from the dropdown
2. Upload an image and get results
3. Results will be translated to your selected language

## 🎯 SDG Alignment

This project directly supports:
- **SDG 1 (No Poverty)**: Empowering smallholder farmers
- **SDG 2 (Zero Hunger)**: Improving crop yields and food security
- **SDG 3 (Good Health)**: Reducing chemical pesticide use
- **SDG 12 (Responsible Consumption)**: Promoting sustainable agriculture

## 🔒 Privacy & Security

- No personal data stored permanently
- Images processed locally when possible
- Free APIs only (no paid services)
- Open-source and transparent

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section below
2. Open an issue on GitHub
3. Contact the development team

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 5000 are available
2. **Image upload fails**: Check file size (max 5MB) and format
3. **Translation errors**: LibreTranslate API may be temporarily unavailable
4. **Weather data issues**: Check internet connection for Open-Meteo API

### Development Tips

- Use `npm run dev` for development with hot reload
- Check browser console for frontend errors
- Check terminal for backend errors
- Use `npm run build` to test production build

---

Built with ❤️ for sustainable agriculture and food security
