const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Initialize SQLite database
const db = new sqlite3.Database('crop_disease.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Disease reports table
    db.run(`CREATE TABLE IF NOT EXISTS disease_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_path TEXT NOT NULL,
      disease_prediction TEXT NOT NULL,
      confidence REAL NOT NULL,
      severity TEXT,
      category TEXT,
      user_email TEXT,
      location TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Add missing columns if they don't exist (with error handling)
    db.run(`ALTER TABLE disease_reports ADD COLUMN severity TEXT DEFAULT 'moderate'`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding severity column:', err);
      }
    });
    db.run(`ALTER TABLE disease_reports ADD COLUMN category TEXT DEFAULT 'fungal'`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding category column:', err);
      }
    });

    // Weather alerts table
    db.run(`CREATE TABLE IF NOT EXISTS weather_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL,
      temperature REAL NOT NULL,
      humidity REAL NOT NULL,
      risk_level TEXT NOT NULL,
      alert_message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // User profiles table
    db.run(`CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      location TEXT,
      preferred_language TEXT DEFAULT 'en',
      notification_enabled BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

// Disease detection endpoint
app.post('/api/detect-disease', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    
    // Enhanced AI disease detection simulation
    const diseaseCategories = {
      'Apple': [
        { name: 'Apple Scab', confidence: 0.85, severity: 'moderate' },
        { name: 'Apple Black Rot', confidence: 0.78, severity: 'high' },
        { name: 'Apple Cedar Rust', confidence: 0.82, severity: 'moderate' },
        { name: 'Apple Healthy', confidence: 0.92, severity: 'none' }
      ],
      'Tomato': [
        { name: 'Tomato Late Blight', confidence: 0.88, severity: 'high' },
        { name: 'Tomato Early Blight', confidence: 0.75, severity: 'moderate' },
        { name: 'Tomato Bacterial Spot', confidence: 0.80, severity: 'moderate' },
        { name: 'Tomato Leaf Mold', confidence: 0.77, severity: 'moderate' },
        { name: 'Tomato Healthy', confidence: 0.90, severity: 'none' }
      ],
      'Corn': [
        { name: 'Corn Common Rust', confidence: 0.83, severity: 'moderate' },
        { name: 'Corn Gray Leaf Spot', confidence: 0.79, severity: 'moderate' },
        { name: 'Corn Healthy', confidence: 0.88, severity: 'none' }
      ],
      'Potato': [
        { name: 'Potato Late Blight', confidence: 0.86, severity: 'high' },
        { name: 'Potato Early Blight', confidence: 0.81, severity: 'moderate' },
        { name: 'Potato Healthy', confidence: 0.89, severity: 'none' }
      ],
      'Grape': [
        { name: 'Grape Black Rot', confidence: 0.84, severity: 'high' },
        { name: 'Grape Esca', confidence: 0.76, severity: 'moderate' },
        { name: 'Grape Leaf Blight', confidence: 0.78, severity: 'moderate' },
        { name: 'Grape Healthy', confidence: 0.91, severity: 'none' }
      ]
    };

    // Simulate more realistic detection based on image analysis
    const allDiseases = Object.values(diseaseCategories).flat();
    
    // Weight towards more common diseases and healthy plants
    const weightedDiseases = [];
    allDiseases.forEach(disease => {
      const weight = disease.name.includes('Healthy') ? 3 : 1; // Healthy plants are more common
      for (let i = 0; i < weight; i++) {
        weightedDiseases.push(disease);
      }
    });

    const selectedDisease = weightedDiseases[Math.floor(Math.random() * weightedDiseases.length)];
    const randomDisease = selectedDisease.name;
    const confidence = Math.round(selectedDisease.confidence * 100);

    // Store the detection result
    const stmt = db.prepare(`
      INSERT INTO disease_reports (image_path, disease_prediction, confidence, severity, category, user_email, location)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      imagePath,
      randomDisease,
      confidence,
      selectedDisease.severity,
      randomDisease.split(' ')[0],
      req.body.email || null,
      req.body.location || null
    ], function(err) {
      if (err) {
        console.error('Database error:', err);
      }
    });
    stmt.finalize();

    // Get treatment recommendations
    const treatment = getTreatmentRecommendation(randomDisease);
    
    res.json({
      success: true,
      disease: randomDisease,
      confidence: confidence,
      severity: selectedDisease.severity,
      treatment: treatment,
      imagePath: imagePath,
      category: randomDisease.split(' ')[0] // Extract crop category
    });

  } catch (error) {
    console.error('Error in disease detection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get treatment recommendations
function getTreatmentRecommendation(disease) {
  const treatments = {
    'Apple Scab': {
      organic: 'Apply copper fungicide spray every 7-10 days during wet weather. Remove fallen leaves and prune for better air circulation. Use neem oil as organic alternative.',
      prevention: 'Plant resistant varieties like Liberty or Enterprise. Maintain proper spacing (15-20 feet), ensure good drainage, and prune annually.',
      severity: 'moderate',
      urgency: 'Treat within 1-2 weeks'
    },
    'Apple Black Rot': {
      organic: 'Remove infected fruit and branches immediately. Apply sulfur-based fungicide during bloom period. Use baking soda spray (1 tbsp per gallon) as organic option.',
      prevention: 'Prune trees to improve air circulation, avoid overhead watering, remove mummified fruit, and sanitize pruning tools.',
      severity: 'high',
      urgency: 'Treat immediately'
    },
    'Apple Cedar Rust': {
      organic: 'Apply copper fungicide in early spring before bud break. Remove nearby cedar trees if possible. Use sulfur spray as organic alternative.',
      prevention: 'Plant resistant varieties, maintain 500+ feet from cedar trees, and apply preventive sprays in early spring.',
      severity: 'moderate',
      urgency: 'Treat before bud break'
    },
    'Apple Healthy': {
      organic: 'Continue current care practices. Apply compost tea monthly for plant health.',
      prevention: 'Maintain regular monitoring, proper watering, and balanced fertilization.',
      severity: 'none',
      urgency: 'Continue monitoring'
    },
    'Tomato Late Blight': {
      organic: 'Remove infected plants immediately. Apply copper fungicide preventively during wet weather. Use baking soda spray (1 tsp per quart) as organic option.',
      prevention: 'Avoid overhead watering, provide good air circulation, plant resistant varieties, and use drip irrigation.',
      severity: 'high',
      urgency: 'Treat immediately'
    },
    'Tomato Early Blight': {
      organic: 'Remove infected leaves immediately. Apply copper fungicide weekly. Use neem oil spray as organic alternative.',
      prevention: 'Rotate crops annually, avoid overhead watering, mulch around plants, and prune lower leaves.',
      severity: 'moderate',
      urgency: 'Treat within 3-5 days'
    },
    'Tomato Bacterial Spot': {
      organic: 'Remove infected plants immediately. Apply copper fungicide preventively. Use hydrogen peroxide spray (1 tsp per cup) as organic option.',
      prevention: 'Use disease-free seeds, avoid overhead watering, maintain proper spacing, and sanitize tools.',
      severity: 'moderate',
      urgency: 'Treat immediately'
    },
    'Tomato Healthy': {
      organic: 'Continue current care practices. Apply compost tea bi-weekly for optimal health.',
      prevention: 'Maintain regular monitoring, proper watering, and balanced fertilization.',
      severity: 'none',
      urgency: 'Continue monitoring'
    },
    'Corn Common Rust': {
      organic: 'Apply copper fungicide at first sign of disease. Remove infected plant debris after harvest. Use neem oil as organic alternative.',
      prevention: 'Plant resistant varieties, rotate crops annually, maintain proper spacing, and avoid overhead watering.',
      severity: 'moderate',
      urgency: 'Treat within 1 week'
    },
    'Corn Gray Leaf Spot': {
      organic: 'Apply copper fungicide preventively. Remove infected debris after harvest. Use baking soda spray as organic option.',
      prevention: 'Plant resistant varieties, rotate crops, maintain proper spacing, and ensure good drainage.',
      severity: 'moderate',
      urgency: 'Treat within 1 week'
    },
    'Corn Healthy': {
      organic: 'Continue current care practices. Apply compost tea monthly for plant health.',
      prevention: 'Maintain regular monitoring, proper watering, and balanced fertilization.',
      severity: 'none',
      urgency: 'Continue monitoring'
    },
    'Potato Late Blight': {
      organic: 'Remove infected foliage immediately. Apply copper fungicide preventively. Use baking soda spray as organic alternative.',
      prevention: 'Plant certified disease-free seed potatoes, avoid overhead watering, rotate crops, and hill soil around plants.',
      severity: 'high',
      urgency: 'Treat immediately'
    },
    'Potato Early Blight': {
      organic: 'Remove infected leaves immediately. Apply copper fungicide weekly. Use neem oil spray as organic option.',
      prevention: 'Rotate crops annually, avoid overhead watering, mulch around plants, and ensure good drainage.',
      severity: 'moderate',
      urgency: 'Treat within 3-5 days'
    },
    'Potato Healthy': {
      organic: 'Continue current care practices. Apply compost tea monthly for plant health.',
      prevention: 'Maintain regular monitoring, proper watering, and balanced fertilization.',
      severity: 'none',
      urgency: 'Continue monitoring'
    },
    'Grape Black Rot': {
      organic: 'Remove infected clusters immediately. Apply copper fungicide preventively. Use sulfur spray as organic alternative.',
      prevention: 'Prune vines for air circulation, avoid overhead watering, remove infected debris, and maintain proper spacing.',
      severity: 'high',
      urgency: 'Treat immediately'
    },
    'Grape Esca': {
      organic: 'Remove infected vines immediately. Apply copper fungicide to cuts. Use hydrogen peroxide spray as organic option.',
      prevention: 'Prune during dry weather, sanitize pruning tools, avoid wounding vines, and maintain vine health.',
      severity: 'moderate',
      urgency: 'Treat immediately'
    },
    'Grape Healthy': {
      organic: 'Continue current care practices. Apply compost tea monthly for plant health.',
      prevention: 'Maintain regular monitoring, proper watering, and balanced fertilization.',
      severity: 'none',
      urgency: 'Continue monitoring'
    }
  };

  return treatments[disease] || {
    organic: 'Monitor plant health regularly and maintain good cultural practices. Apply organic fungicide preventively. Consult local agricultural extension for specific recommendations.',
    prevention: 'Ensure proper spacing, good drainage, regular monitoring for early detection, and crop rotation.',
    severity: 'unknown',
    urgency: 'Monitor closely'
  };
}

// Economic impact calculation function
function calculateEconomicImpact(disease, cropType, farmSize, currentYield) {
  const cropPrices = {
    'Apple': 2.50,
    'Tomato': 1.80,
    'Corn': 0.15,
    'Potato': 0.80,
    'Grape': 3.20
  };

  const diseaseImpact = {
    'high': 0.6,    // 60% yield loss
    'moderate': 0.3, // 30% yield loss
    'low': 0.1,     // 10% yield loss
    'none': 0       // No yield loss
  };

  const treatmentCosts = {
    'high': 150,    // $150 per acre
    'moderate': 75, // $75 per acre
    'low': 25,      // $25 per acre
    'none': 0       // No treatment cost
  };

  const basePrice = cropPrices[cropType] || 1.0;
  const severity = getDiseaseSeverity(disease);
  const yieldLoss = diseaseImpact[severity] || 0.2;
  const treatmentCost = treatmentCosts[severity] || 50;

  const potentialYield = currentYield * (1 - yieldLoss);
  const yieldLossAmount = currentYield - potentialYield;
  const revenueLoss = yieldLossAmount * basePrice;
  const totalCost = treatmentCost * farmSize;
  const netLoss = revenueLoss + totalCost;

  return {
    cropType,
    disease,
    severity,
    farmSize,
    currentYield,
    potentialYield: Math.round(potentialYield * 100) / 100,
    yieldLoss: Math.round(yieldLoss * 100),
    yieldLossAmount: Math.round(yieldLossAmount * 100) / 100,
    basePrice,
    revenueLoss: Math.round(revenueLoss * 100) / 100,
    treatmentCost: Math.round(totalCost * 100) / 100,
    netLoss: Math.round(netLoss * 100) / 100,
    roi: Math.round(((revenueLoss - totalCost) / totalCost) * 100) / 100
  };
}

// Get disease severity helper
function getDiseaseSeverity(disease) {
  if (disease.toLowerCase().includes('healthy')) return 'none';
  if (disease.toLowerCase().includes('late blight') || 
      disease.toLowerCase().includes('black rot') ||
      disease.toLowerCase().includes('bacterial spot')) return 'high';
  if (disease.toLowerCase().includes('early blight') ||
      disease.toLowerCase().includes('scab') ||
      disease.toLowerCase().includes('rust')) return 'moderate';
  return 'low';
}

// Market prices function
function getMarketPrices(crop) {
  const basePrices = {
    // Major Indian Crops (prices in INR per kg)
    'rice': { current: 55, weekly: 52, monthly: 58, trend: 'rising' },
    'wheat': { current: 28, weekly: 30, monthly: 26, trend: 'falling' },
    'maize': { current: 22, weekly: 20, monthly: 24, trend: 'rising' },
    'sugarcane': { current: 18, weekly: 16, monthly: 20, trend: 'rising' },
    'cotton': { current: 65, weekly: 70, monthly: 60, trend: 'falling' },
    'tomato': { current: 45, weekly: 42, monthly: 48, trend: 'rising' },
    'potato': { current: 25, weekly: 28, monthly: 22, trend: 'falling' },
    'onion': { current: 35, weekly: 30, monthly: 40, trend: 'rising' },
    'chili': { current: 120, weekly: 110, monthly: 130, trend: 'rising' },
    'turmeric': { current: 85, weekly: 80, monthly: 90, trend: 'rising' },
    'ginger': { current: 95, weekly: 90, monthly: 100, trend: 'rising' },
    'garlic': { current: 75, weekly: 70, monthly: 80, trend: 'rising' },
    'cabbage': { current: 20, weekly: 18, monthly: 22, trend: 'rising' },
    'cauliflower': { current: 25, weekly: 22, monthly: 28, trend: 'rising' },
    'brinjal': { current: 30, weekly: 28, monthly: 32, trend: 'rising' },
    'okra': { current: 40, weekly: 35, monthly: 45, trend: 'rising' },
    'cucumber': { current: 15, weekly: 12, monthly: 18, trend: 'rising' },
    'bottle gourd': { current: 18, weekly: 16, monthly: 20, trend: 'rising' },
    'bitter gourd': { current: 35, weekly: 32, monthly: 38, trend: 'rising' },
    'ridge gourd': { current: 22, weekly: 20, monthly: 24, trend: 'rising' },
    'spinach': { current: 12, weekly: 10, monthly: 14, trend: 'rising' },
    'coriander': { current: 8, weekly: 6, monthly: 10, trend: 'rising' },
    'mint': { current: 15, weekly: 12, monthly: 18, trend: 'rising' },
    'fenugreek': { current: 25, weekly: 22, monthly: 28, trend: 'rising' },
    'mustard': { current: 45, weekly: 42, monthly: 48, trend: 'rising' },
    'sunflower': { current: 55, weekly: 50, monthly: 60, trend: 'rising' },
    'groundnut': { current: 65, weekly: 60, monthly: 70, trend: 'rising' },
    'sesame': { current: 85, weekly: 80, monthly: 90, trend: 'rising' },
    'soybean': { current: 35, weekly: 32, monthly: 38, trend: 'rising' },
    'chickpea': { current: 45, weekly: 42, monthly: 48, trend: 'rising' },
    'lentil': { current: 55, weekly: 50, monthly: 60, trend: 'rising' },
    'black gram': { current: 65, weekly: 60, monthly: 70, trend: 'rising' },
    'green gram': { current: 45, weekly: 42, monthly: 48, trend: 'rising' },
    'pigeon pea': { current: 55, weekly: 50, monthly: 60, trend: 'rising' },
    'mango': { current: 80, weekly: 75, monthly: 85, trend: 'rising' },
    'banana': { current: 25, weekly: 22, monthly: 28, trend: 'rising' },
    'papaya': { current: 15, weekly: 12, monthly: 18, trend: 'rising' },
    'guava': { current: 30, weekly: 28, monthly: 32, trend: 'rising' },
    'pomegranate': { current: 120, weekly: 110, monthly: 130, trend: 'rising' },
    'grapes': { current: 60, weekly: 55, monthly: 65, trend: 'rising' },
    'orange': { current: 35, weekly: 32, monthly: 38, trend: 'rising' },
    'lemon': { current: 20, weekly: 18, monthly: 22, trend: 'rising' },
    'coconut': { current: 8, weekly: 7, monthly: 9, trend: 'rising' },
    'cashew': { current: 180, weekly: 170, monthly: 190, trend: 'rising' },
    'almond': { current: 220, weekly: 200, monthly: 240, trend: 'rising' },
    'walnut': { current: 250, weekly: 240, monthly: 260, trend: 'rising' },
    'cardamom': { current: 1200, weekly: 1100, monthly: 1300, trend: 'rising' },
    'pepper': { current: 180, weekly: 170, monthly: 190, trend: 'rising' },
    'cinnamon': { current: 150, weekly: 140, monthly: 160, trend: 'rising' },
    'clove': { current: 200, weekly: 190, monthly: 210, trend: 'rising' },
    'nutmeg': { current: 160, weekly: 150, monthly: 170, trend: 'rising' },
    'vanilla': { current: 800, weekly: 750, monthly: 850, trend: 'rising' }
  };

  const cropKey = crop.toLowerCase();
  return basePrices[cropKey] || { current: 30, weekly: 28, monthly: 32, trend: 'stable' };
}

// Crop planner data function
function getCropPlannerData(crop) {
  const planners = {
    'rice': {
      planting: { month: 'June-July (Kharif)', temperature: '25-35°C', soil: 'Clay loam, pH 6.0-7.0' },
      growing: { duration: '4-5 months', watering: 'Continuous flooding', fertilizing: 'NPK 120:60:60 kg/ha' },
      harvesting: { month: 'October-November', indicators: 'Grains hard, 80% moisture' },
      maintenance: ['Water management', 'Weed control', 'Pest monitoring'],
      schedule: [
        { month: 'June', tasks: ['Land preparation', 'Seedling preparation'] },
        { month: 'July', tasks: ['Transplanting', 'Water management'] },
        { month: 'August', tasks: ['Fertilizer application', 'Weed control'] },
        { month: 'October', tasks: ['Harvesting', 'Threshing'] }
      ]
    },
    'wheat': {
      planting: { month: 'October-November (Rabi)', temperature: '15-25°C', soil: 'Well-drained, pH 6.5-7.5' },
      growing: { duration: '4-5 months', watering: '3-4 irrigations', fertilizing: 'NPK 120:60:40 kg/ha' },
      harvesting: { month: 'March-April', indicators: 'Grains hard, golden color' },
      maintenance: ['Weed control', 'Disease monitoring', 'Irrigation management'],
      schedule: [
        { month: 'October', tasks: ['Land preparation', 'Sowing'] },
        { month: 'December', tasks: ['First irrigation', 'Fertilizer application'] },
        { month: 'February', tasks: ['Second irrigation', 'Disease control'] },
        { month: 'March', tasks: ['Harvesting', 'Threshing'] }
      ]
    },
    'maize': {
      planting: { month: 'June-July (Kharif)', temperature: '20-30°C', soil: 'Well-drained, pH 6.0-7.0' },
      growing: { duration: '3-4 months', watering: '5-6 irrigations', fertilizing: 'NPK 120:60:40 kg/ha' },
      harvesting: { month: 'September-October', indicators: 'Kernels hard, moisture 20-25%' },
      maintenance: ['Weed control', 'Pest monitoring', 'Earthing up'],
      schedule: [
        { month: 'June', tasks: ['Land preparation', 'Sowing'] },
        { month: 'July', tasks: ['Thinning', 'First irrigation'] },
        { month: 'August', tasks: ['Fertilizer application', 'Earthing up'] },
        { month: 'September', tasks: ['Harvesting', 'Drying'] }
      ]
    },
    'sugarcane': {
      planting: { month: 'October-November', temperature: '25-35°C', soil: 'Deep, well-drained, pH 6.5-7.5' },
      growing: { duration: '12-18 months', watering: 'Regular irrigation', fertilizing: 'NPK 200:100:100 kg/ha' },
      harvesting: { month: 'October-March', indicators: 'Sucrose content 12-14%' },
      maintenance: ['Weed control', 'Pest management', 'Ratoon management'],
      schedule: [
        { month: 'October', tasks: ['Land preparation', 'Planting'] },
        { month: 'December', tasks: ['Gap filling', 'First irrigation'] },
        { month: 'March', tasks: ['Fertilizer application', 'Weed control'] },
        { month: 'October', tasks: ['Harvesting', 'Ratoon preparation'] }
      ]
    },
    'cotton': {
      planting: { month: 'April-May', temperature: '25-35°C', soil: 'Well-drained, pH 6.0-8.0' },
      growing: { duration: '6-7 months', watering: '4-5 irrigations', fertilizing: 'NPK 100:50:50 kg/ha' },
      harvesting: { month: 'October-December', indicators: 'Bolls open, fiber mature' },
      maintenance: ['Pest control', 'Weed management', 'Pruning'],
      schedule: [
        { month: 'April', tasks: ['Land preparation', 'Sowing'] },
        { month: 'June', tasks: ['Thinning', 'First irrigation'] },
        { month: 'August', tasks: ['Fertilizer application', 'Pest control'] },
        { month: 'October', tasks: ['Harvesting', 'Ginning'] }
      ]
    },
    'tomato': {
      planting: { month: 'October-November', temperature: '20-30°C', soil: 'Well-drained, pH 6.0-6.8' },
      growing: { duration: '3-4 months', watering: 'Regular irrigation', fertilizing: 'NPK 100:50:50 kg/ha' },
      harvesting: { month: 'January-March', indicators: 'Firm, full color' },
      maintenance: ['Staking', 'Pruning', 'Disease control'],
      schedule: [
        { month: 'October', tasks: ['Nursery preparation', 'Seedling raising'] },
        { month: 'November', tasks: ['Transplanting', 'Staking'] },
        { month: 'January', tasks: ['Fertilizer application', 'Pruning'] },
        { month: 'February', tasks: ['Harvesting', 'Grading'] }
      ]
    },
    'potato': {
      planting: { month: 'October-November', temperature: '15-25°C', soil: 'Well-drained, pH 5.5-6.5' },
      growing: { duration: '3-4 months', watering: 'Regular irrigation', fertilizing: 'NPK 120:80:80 kg/ha' },
      harvesting: { month: 'January-March', indicators: 'Vines dry, tubers mature' },
      maintenance: ['Earthing up', 'Disease control', 'Weed management'],
      schedule: [
        { month: 'October', tasks: ['Land preparation', 'Planting'] },
        { month: 'November', tasks: ['Earthing up', 'First irrigation'] },
        { month: 'January', tasks: ['Fertilizer application', 'Disease control'] },
        { month: 'February', tasks: ['Harvesting', 'Curing'] }
      ]
    },
    'onion': {
      planting: { month: 'October-November', temperature: '15-25°C', soil: 'Well-drained, pH 6.0-7.0' },
      growing: { duration: '4-5 months', watering: 'Regular irrigation', fertilizing: 'NPK 100:50:50 kg/ha' },
      harvesting: { month: 'March-April', indicators: 'Tops fall over, bulbs mature' },
      maintenance: ['Weed control', 'Disease management', 'Bulb development'],
      schedule: [
        { month: 'October', tasks: ['Nursery preparation', 'Seedling raising'] },
        { month: 'November', tasks: ['Transplanting', 'First irrigation'] },
        { month: 'January', tasks: ['Fertilizer application', 'Weed control'] },
        { month: 'March', tasks: ['Harvesting', 'Curing'] }
      ]
    },
    'chili': {
      planting: { month: 'June-July', temperature: '20-30°C', soil: 'Well-drained, pH 6.0-7.0' },
      growing: { duration: '4-5 months', watering: 'Regular irrigation', fertilizing: 'NPK 80:40:40 kg/ha' },
      harvesting: { month: 'September-December', indicators: 'Pods red, fully mature' },
      maintenance: ['Staking', 'Pest control', 'Pruning'],
      schedule: [
        { month: 'June', tasks: ['Nursery preparation', 'Seedling raising'] },
        { month: 'July', tasks: ['Transplanting', 'Staking'] },
        { month: 'August', tasks: ['Fertilizer application', 'Pest control'] },
        { month: 'September', tasks: ['Harvesting', 'Drying'] }
      ]
    },
    'mango': {
      planting: { month: 'July-August', temperature: '25-35°C', soil: 'Deep, well-drained, pH 6.0-7.5' },
      growing: { duration: 'Perennial', watering: 'Regular irrigation', fertilizing: 'NPK 100:50:50 kg/tree' },
      harvesting: { month: 'April-July', indicators: 'Fruits mature, color change' },
      maintenance: ['Pruning', 'Pest control', 'Flowering management'],
      schedule: [
        { month: 'July', tasks: ['Planting', 'Initial care'] },
        { month: 'October', tasks: ['Pruning', 'Fertilizer application'] },
        { month: 'January', tasks: ['Flowering', 'Pest control'] },
        { month: 'April', tasks: ['Harvesting', 'Post-harvest care'] }
      ]
    }
  };

  return planners[crop.toLowerCase()] || planners['rice'];
}

// Knowledge base data function
function getKnowledgeBaseData() {
  return {
    diseases: [
      {
        name: 'Apple Scab',
        description: 'Fungal disease causing dark spots on leaves and fruit',
        symptoms: ['Dark spots on leaves', 'Cracked fruit', 'Premature leaf drop'],
        prevention: ['Plant resistant varieties', 'Improve air circulation', 'Remove fallen leaves'],
        treatment: ['Copper fungicide', 'Sulfur spray', 'Prune infected branches']
      },
      {
        name: 'Tomato Late Blight',
        description: 'Devastating fungal disease affecting tomatoes and potatoes',
        symptoms: ['Water-soaked spots', 'White mold on leaves', 'Rapid plant death'],
        prevention: ['Avoid overhead watering', 'Plant resistant varieties', 'Good air circulation'],
        treatment: ['Copper fungicide', 'Remove infected plants', 'Improve drainage']
      }
    ],
    treatments: [
      {
        name: 'Copper Fungicide',
        description: 'Organic fungicide effective against many plant diseases',
        usage: 'Apply every 7-10 days during wet weather',
        safety: 'Safe for organic farming, follow label instructions'
      },
      {
        name: 'Neem Oil',
        description: 'Natural pesticide and fungicide from neem tree',
        usage: 'Apply weekly as preventive measure',
        safety: 'Safe for beneficial insects, avoid during flowering'
      }
    ],
    tips: [
      'Rotate crops annually to prevent disease buildup',
      'Use drip irrigation to avoid wetting leaves',
      'Plant disease-resistant varieties when available',
      'Monitor plants regularly for early disease detection',
      'Maintain proper spacing for good air circulation'
    ]
  };
}

// AI predictions function
function generateAIPredictions(disease, weather, location, cropType) {
  const riskFactors = {
    temperature: weather.temperature > 25 ? 'high' : weather.temperature < 10 ? 'low' : 'moderate',
    humidity: weather.humidity > 80 ? 'high' : weather.humidity < 50 ? 'low' : 'moderate',
    season: new Date().getMonth() >= 5 && new Date().getMonth() <= 8 ? 'growing' : 'dormant'
  };

  const diseaseRisk = calculateDiseaseRisk(disease, riskFactors);
  const spreadProbability = calculateSpreadProbability(disease, weather, location);
  const treatmentEffectiveness = calculateTreatmentEffectiveness(disease, weather);

  return {
    diseaseRisk: diseaseRisk,
    spreadProbability: spreadProbability,
    treatmentEffectiveness: treatmentEffectiveness,
    recommendations: generateRecommendations(disease, riskFactors),
    timeline: generateTimeline(disease, riskFactors),
    confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
  };
}

function calculateDiseaseRisk(disease, factors) {
  let risk = 0.5; // Base risk
  
  if (factors.temperature === 'high') risk += 0.2;
  if (factors.humidity === 'high') risk += 0.3;
  if (factors.season === 'growing') risk += 0.1;
  
  return Math.min(risk, 1.0);
}

function calculateSpreadProbability(disease, weather, location) {
  let probability = 0.3; // Base probability
  
  if (weather.humidity > 80) probability += 0.3;
  if (weather.temperature > 25) probability += 0.2;
  
  return Math.min(probability, 0.9);
}

function calculateTreatmentEffectiveness(disease, weather) {
  let effectiveness = 0.7; // Base effectiveness
  
  if (weather.humidity < 60) effectiveness += 0.2;
  if (weather.temperature < 30) effectiveness += 0.1;
  
  return Math.min(effectiveness, 0.95);
}

function generateRecommendations(disease, factors) {
  const recommendations = [];
  
  if (factors.humidity === 'high') {
    recommendations.push('Improve air circulation around plants');
    recommendations.push('Consider using fans in greenhouse');
  }
  
  if (factors.temperature === 'high') {
    recommendations.push('Provide shade during hottest hours');
    recommendations.push('Increase watering frequency');
  }
  
  recommendations.push('Apply preventive fungicide treatment');
  recommendations.push('Monitor plants daily for early symptoms');
  
  return recommendations;
}

function generateTimeline(disease, factors) {
  return [
    { day: 1, action: 'Apply initial treatment', priority: 'high' },
    { day: 3, action: 'Monitor for improvement', priority: 'medium' },
    { day: 7, action: 'Reapply treatment if needed', priority: 'high' },
    { day: 14, action: 'Assess treatment effectiveness', priority: 'medium' },
    { day: 21, action: 'Plan long-term prevention', priority: 'low' }
  ];
}

// Weather data endpoint
app.get('/api/weather/:location', async (req, res) => {
  try {
    const { location } = req.params;
    
    // Indian city coordinates
    const cityCoords = {
      'mumbai': { lat: 19.0760, lon: 72.8777 },
      'delhi': { lat: 28.7041, lon: 77.1025 },
      'bangalore': { lat: 12.9716, lon: 77.5946 },
      'hyderabad': { lat: 17.3850, lon: 78.4867 },
      'chennai': { lat: 13.0827, lon: 80.2707 },
      'kolkata': { lat: 22.5726, lon: 88.3639 },
      'pune': { lat: 18.5204, lon: 73.8567 },
      'ahmedabad': { lat: 23.0225, lon: 72.5714 },
      'jaipur': { lat: 26.9124, lon: 75.7873 },
      'lucknow': { lat: 26.8467, lon: 80.9462 },
      'kanpur': { lat: 26.4499, lon: 80.3319 },
      'nagpur': { lat: 21.1458, lon: 79.0882 },
      'indore': { lat: 22.7196, lon: 75.8577 },
      'thane': { lat: 19.2183, lon: 72.9781 },
      'bhopal': { lat: 23.2599, lon: 77.4126 },
      'visakhapatnam': { lat: 17.6868, lon: 83.2185 },
      'pimpri': { lat: 18.6298, lon: 73.7997 },
      'patna': { lat: 25.5941, lon: 85.1376 },
      'vadodara': { lat: 22.3072, lon: 73.1812 },
      'ludhiana': { lat: 30.9010, lon: 75.8573 }
    };
    
    const coords = cityCoords[location.toLowerCase()] || cityCoords['mumbai'];
    
    let temperature, humidity, riskLevel, alertMessage;
    
    try {
      // Use Open-Meteo API (free, no API key required)
      const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
        params: {
          latitude: coords.lat,
          longitude: coords.lon,
          current: 'temperature_2m,relative_humidity_2m',
          hourly: 'temperature_2m,relative_humidity_2m',
          timezone: 'Asia/Kolkata'
        }
      });

      const { current } = response.data;
      temperature = current.temperature_2m;
      humidity = current.relative_humidity_2m;
    } catch (apiError) {
      console.log('Weather API failed, using fallback data for', location);
      // Fallback data based on location
      const fallbackData = {
        'mumbai': { temp: 28, humidity: 85 },
        'delhi': { temp: 32, humidity: 65 },
        'bangalore': { temp: 26, humidity: 70 },
        'hyderabad': { temp: 30, humidity: 75 },
        'chennai': { temp: 29, humidity: 80 },
        'kolkata': { temp: 31, humidity: 85 },
        'pune': { temp: 27, humidity: 70 },
        'ahmedabad': { temp: 33, humidity: 60 },
        'jaipur': { temp: 34, humidity: 55 },
        'lucknow': { temp: 30, humidity: 70 },
        'kanpur': { temp: 31, humidity: 68 },
        'nagpur': { temp: 29, humidity: 72 },
        'indore': { temp: 28, humidity: 65 },
        'thane': { temp: 27, humidity: 75 },
        'bhopal': { temp: 29, humidity: 70 },
        'visakhapatnam': { temp: 30, humidity: 80 },
        'pimpri': { temp: 27, humidity: 72 },
        'patna': { temp: 30, humidity: 75 },
        'vadodara': { temp: 32, humidity: 68 },
        'ludhiana': { temp: 33, humidity: 60 }
      };
      
      const fallback = fallbackData[location.toLowerCase()] || fallbackData['mumbai'];
      temperature = fallback.temp;
      humidity = fallback.humidity;
    }

    // Determine disease risk based on weather conditions
    riskLevel = 'low';
    alertMessage = 'Weather conditions are favorable for healthy crops.';

    if (humidity > 80 && temperature > 25) {
      riskLevel = 'high';
      alertMessage = 'High humidity and temperature create favorable conditions for fungal diseases. Monitor crops closely.';
    } else if (humidity > 70 || temperature > 30) {
      riskLevel = 'medium';
      alertMessage = 'Moderate risk conditions detected. Consider preventive measures.';
    }

    // Store weather alert if risk is medium or high
    if (riskLevel !== 'low') {
      const stmt = db.prepare(`
        INSERT INTO weather_alerts (location, temperature, humidity, risk_level, alert_message)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run([location, temperature, humidity, riskLevel, alertMessage]);
      stmt.finalize();
    }

    res.json({
      location,
      temperature,
      humidity,
      riskLevel,
      alertMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Analytics endpoint for disease data
app.get('/api/analytics/disease-stats', (req, res) => {
  try {
    db.all(`
      SELECT 
        disease_prediction,
        COUNT(*) as count,
        AVG(confidence) as avg_confidence,
        severity
      FROM disease_reports 
      GROUP BY disease_prediction
      ORDER BY count DESC
    `, (err, rows) => {
      if (err) {
        console.error('Analytics error:', err);
        return res.status(500).json({ error: 'Failed to fetch analytics data' });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Analytics service error' });
  }
});

// Economic impact calculator endpoint
app.post('/api/economic-impact', (req, res) => {
  try {
    const { disease, cropType, farmSize, currentYield } = req.body;
    
    // Economic impact calculations
    const impactData = calculateEconomicImpact(disease, cropType, farmSize, currentYield);
    
    res.json({
      success: true,
      ...impactData
    });
  } catch (error) {
    console.error('Economic calculation error:', error);
    res.status(500).json({ error: 'Economic calculation failed' });
  }
});

// Market prices endpoint
app.get('/api/market-prices/:crop', async (req, res) => {
  try {
    const { crop } = req.params;
    
    // Mock market data (in real app, connect to market APIs)
    const marketData = getMarketPrices(crop);
    
    res.json({
      success: true,
      crop: crop,
      prices: marketData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get disease history
app.get('/api/disease-history/:email', (req, res) => {
  const { email } = req.params;
  
  db.all(
    'SELECT * FROM disease_reports WHERE user_email = ? ORDER BY timestamp DESC LIMIT 10',
    [email],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

// Email notifications endpoint
app.post('/api/send-notification', async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    
    if (!email || !subject || !message) {
      return res.status(400).json({ error: 'Email, subject, and message are required' });
    }

    // For demo purposes, we'll simulate email sending
    // In production, configure with actual Gmail credentials
    console.log(`Email notification to ${email}: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Email notification error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Crop management planner endpoint
app.get('/api/crop-planner/:crop', (req, res) => {
  try {
    const { crop } = req.params;
    const plannerData = getCropPlannerData(crop);
    
    res.json({
      success: true,
      crop: crop,
      planner: plannerData
    });
  } catch (error) {
    console.error('Crop planner error:', error);
    res.status(500).json({ error: 'Failed to fetch crop planner data' });
  }
});

// Knowledge base endpoint
app.get('/api/knowledge-base', (req, res) => {
  try {
    const knowledgeData = getKnowledgeBaseData();
    res.json({
      success: true,
      knowledge: knowledgeData
    });
  } catch (error) {
    console.error('Knowledge base error:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge base' });
  }
});

// Advanced AI predictions endpoint
app.post('/api/ai-predictions', (req, res) => {
  try {
    const { disease, weather, location, cropType } = req.body;
    const predictions = generateAIPredictions(disease, weather, location, cropType);
    
    res.json({
      success: true,
      predictions: predictions
    });
  } catch (error) {
    console.error('AI predictions error:', error);
    res.status(500).json({ error: 'AI prediction failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
