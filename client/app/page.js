'use client'

import { useState, useEffect } from 'react'
import { Upload, Leaf, AlertTriangle, Cloud, Mail, BarChart3, Calculator, Calendar, Brain, BookOpen, TrendingUp } from 'lucide-react'
import ImageUpload from './components/ImageUpload'
import DiseaseResult from './components/DiseaseResult'
import WeatherAlert from './components/WeatherAlert'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import EconomicCalculator from './components/EconomicCalculator'
import CropPlanner from './components/CropPlanner'
import KnowledgeBase from './components/KnowledgeBase'
import MarketIntegration from './components/MarketIntegration'
import AIPredictions from './components/AIPredictions'
import LocationSelector from './components/LocationSelector'
import toast from 'react-hot-toast'

export default function Home() {
  const [detectionResult, setDetectionResult] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('detection')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [marketData, setMarketData] = useState(null)
  const [knowledgeData, setKnowledgeData] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState('mumbai')

  useEffect(() => {
    // Fetch initial data
    fetchWeatherData()
    fetchAnalyticsData()
    fetchMarketData()
    fetchKnowledgeData()
  }, [])

  const fetchWeatherData = async (location = selectedLocation) => {
    try {
      const response = await fetch(`/api/weather/${location}`)
      if (!response.ok) {
        throw new Error('Weather API failed')
      }
      const data = await response.json()
      setWeatherData(data)
    } catch (error) {
      console.error('Error fetching weather data:', error)
      // Set fallback weather data
      setWeatherData({
        location: location,
        temperature: 25,
        humidity: 60,
        riskLevel: 'low',
        alertMessage: 'Weather data unavailable'
      })
    }
  }

  const handleLocationChange = (location) => {
    setSelectedLocation(location)
    fetchWeatherData(location)
  }

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics/disease-stats')
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    }
  }

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/market-prices/tomato')
      const data = await response.json()
      setMarketData(data)
    } catch (error) {
      console.error('Error fetching market data:', error)
    }
  }

  const fetchKnowledgeData = async () => {
    try {
      const response = await fetch('/api/knowledge-base')
      const data = await response.json()
      setKnowledgeData(data)
    } catch (error) {
      console.error('Error fetching knowledge data:', error)
    }
  }

  const handleImageUpload = async (file, userEmail, location) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('email', userEmail)
      formData.append('location', location)

      const response = await fetch('/api/detect-disease', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (result.success) {
        setDetectionResult(result)
        toast.success('Disease detection completed!')
        
        // Refresh data after detection
        fetchWeatherData()
        fetchAnalyticsData()
      } else {
        toast.error('Detection failed. Please try again.')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error uploading image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">CropGuard</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('detection')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'detection' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Disease Detection
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'analytics' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('market')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'market' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Market
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Crop Disease Detection
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a photo of your crop leaves to get instant disease detection, 
            organic treatment recommendations, and weather-based risk alerts.
          </p>
        </div>

        {/* Location Selection and Weather Alert */}
        <div className="mb-8">
          <LocationSelector 
            onLocationChange={handleLocationChange}
            currentLocation={selectedLocation}
          />
          {weatherData && weatherData.riskLevel !== 'low' && (
            <div className="mt-4">
              <WeatherAlert weatherData={weatherData} />
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'detection' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div className="card">
              <div className="flex items-center mb-6">
                <Upload className="h-6 w-6 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Upload Crop Image
                </h3>
              </div>
              <ImageUpload 
                onUpload={handleImageUpload}
                loading={loading}
              />
            </div>

            {/* Detection Results */}
            <div className="card">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-6 w-6 text-warning-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Detection Results
                </h3>
              </div>
              {detectionResult ? (
                <DiseaseResult 
                  result={detectionResult}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Leaf className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Upload an image to see disease detection results</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <AnalyticsDashboard data={analyticsData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <EconomicCalculator predictedDisease={detectionResult?.disease || ''} />
              <CropPlanner />
            </div>
            <AIPredictions weatherData={weatherData} predictedDisease={detectionResult?.disease || ''} />
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-8">
            <MarketIntegration data={marketData} />
            <KnowledgeBase data={knowledgeData} />
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Disease Detection
            </h3>
            <p className="text-gray-600">
              Advanced machine learning models trained on thousands of crop images 
              for accurate disease identification.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Cloud className="h-8 w-8 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Weather Alerts
            </h3>
            <p className="text-gray-600">
              Real-time weather monitoring to predict disease risk conditions 
              and provide preventive recommendations.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-warning-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multi-Language Support
            </h3>
            <p className="text-gray-600">
              Get results and recommendations in your local language 
              for better understanding and accessibility.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p>Built for sustainable agriculture • Supporting SDGs 1, 2, 3, and 12</p>
        </footer>
      </main>
    </div>
  )
}
