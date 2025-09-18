#!/usr/bin/env node

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing CropGuard API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Weather Data
    console.log('2. Testing weather endpoint...');
    const weatherResponse = await axios.get(`${BASE_URL}/api/weather/New York`);
    console.log('✅ Weather data retrieved:', {
      location: weatherResponse.data.location,
      temperature: weatherResponse.data.temperature,
      humidity: weatherResponse.data.humidity,
      riskLevel: weatherResponse.data.riskLevel
    });
    console.log('');

    // Test 3: Translation
    console.log('3. Testing translation endpoint...');
    const translationResponse = await axios.post(`${BASE_URL}/api/translate`, {
      text: 'Your crop appears to be healthy. Continue monitoring for any changes.',
      targetLang: 'es'
    });
    console.log('✅ Translation successful:', translationResponse.data.translatedText);
    console.log('');

    // Test 4: Disease Detection (mock)
    console.log('4. Testing disease detection endpoint...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    formData.append('image', testImageBuffer, 'test-image.png');
    formData.append('email', 'test@example.com');
    formData.append('location', 'Test Location');

    const detectionResponse = await axios.post(`${BASE_URL}/api/detect-disease`, formData, {
      headers: formData.getHeaders()
    });

    console.log('✅ Disease detection successful:', {
      disease: detectionResponse.data.disease,
      confidence: detectionResponse.data.confidence,
      hasTreatment: !!detectionResponse.data.treatment
    });
    console.log('');

    // Test 5: Email Notification
    console.log('5. Testing email notification endpoint...');
    const notificationResponse = await axios.post(`${BASE_URL}/api/send-notification`, {
      email: 'test@example.com',
      subject: 'Test Alert',
      message: 'This is a test notification from CropGuard.'
    });
    console.log('✅ Email notification sent:', notificationResponse.data.message);
    console.log('');

    console.log('🎉 All tests passed! The API is working correctly.');
    console.log('\n📋 Summary:');
    console.log('- Health check: ✅');
    console.log('- Weather API: ✅');
    console.log('- Translation API: ✅');
    console.log('- Disease detection: ✅');
    console.log('- Email notifications: ✅');
    console.log('\n🚀 Ready for deployment!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
