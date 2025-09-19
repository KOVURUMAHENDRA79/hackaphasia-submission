'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, BarChart3, ArrowUp, ArrowDown, Minus } from 'lucide-react'

export default function MarketIntegration({ data }) {
  const [selectedCrop, setSelectedCrop] = useState('rice')
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(false)

  const crops = [
    { value: 'rice', label: 'Rice', icon: '🌾' },
    { value: 'wheat', label: 'Wheat', icon: '🌾' },
    { value: 'maize', label: 'Maize', icon: '🌽' },
    { value: 'sugarcane', label: 'Sugarcane', icon: '🎋' },
    { value: 'cotton', label: 'Cotton', icon: '🌿' },
    { value: 'tomato', label: 'Tomato', icon: '🍅' },
    { value: 'potato', label: 'Potato', icon: '🥔' },
    { value: 'onion', label: 'Onion', icon: '🧅' },
    { value: 'chili', label: 'Chili', icon: '🌶️' },
    { value: 'turmeric', label: 'Turmeric', icon: '🟡' },
    { value: 'ginger', label: 'Ginger', icon: '🟤' },
    { value: 'garlic', label: 'Garlic', icon: '🧄' },
    { value: 'cabbage', label: 'Cabbage', icon: '🥬' },
    { value: 'cauliflower', label: 'Cauliflower', icon: '🥦' },
    { value: 'brinjal', label: 'Brinjal', icon: '🍆' },
    { value: 'okra', label: 'Okra', icon: '🟢' },
    { value: 'cucumber', label: 'Cucumber', icon: '🥒' },
    { value: 'bottle gourd', label: 'Bottle Gourd', icon: '🟢' },
    { value: 'bitter gourd', label: 'Bitter Gourd', icon: '🟢' },
    { value: 'ridge gourd', label: 'Ridge Gourd', icon: '🟢' },
    { value: 'spinach', label: 'Spinach', icon: '🥬' },
    { value: 'coriander', label: 'Coriander', icon: '🌿' },
    { value: 'mint', label: 'Mint', icon: '🌿' },
    { value: 'fenugreek', label: 'Fenugreek', icon: '🌿' },
    { value: 'mustard', label: 'Mustard', icon: '🟡' },
    { value: 'sunflower', label: 'Sunflower', icon: '🌻' },
    { value: 'groundnut', label: 'Groundnut', icon: '🥜' },
    { value: 'sesame', label: 'Sesame', icon: '⚫' },
    { value: 'soybean', label: 'Soybean', icon: '🟤' },
    { value: 'chickpea', label: 'Chickpea', icon: '🟤' },
    { value: 'lentil', label: 'Lentil', icon: '🟤' },
    { value: 'black gram', label: 'Black Gram', icon: '⚫' },
    { value: 'green gram', label: 'Green Gram', icon: '🟢' },
    { value: 'pigeon pea', label: 'Pigeon Pea', icon: '🟤' },
    { value: 'mango', label: 'Mango', icon: '🥭' },
    { value: 'banana', label: 'Banana', icon: '🍌' },
    { value: 'papaya', label: 'Papaya', icon: '🥭' },
    { value: 'guava', label: 'Guava', icon: '🟢' },
    { value: 'pomegranate', label: 'Pomegranate', icon: '🔴' },
    { value: 'grapes', label: 'Grapes', icon: '🍇' },
    { value: 'orange', label: 'Orange', icon: '🍊' },
    { value: 'lemon', label: 'Lemon', icon: '🍋' },
    { value: 'coconut', label: 'Coconut', icon: '🥥' },
    { value: 'cashew', label: 'Cashew', icon: '🥜' },
    { value: 'almond', label: 'Almond', icon: '🥜' },
    { value: 'walnut', label: 'Walnut', icon: '🥜' },
    { value: 'cardamom', label: 'Cardamom', icon: '🟢' },
    { value: 'pepper', label: 'Pepper', icon: '⚫' },
    { value: 'cinnamon', label: 'Cinnamon', icon: '🟤' },
    { value: 'clove', label: 'Clove', icon: '🟤' },
    { value: 'nutmeg', label: 'Nutmeg', icon: '🟤' },
    { value: 'vanilla', label: 'Vanilla', icon: '🟤' }
  ]

  useEffect(() => {
    fetchMarketData(selectedCrop)
  }, [selectedCrop])

  const fetchMarketData = async (crop) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/market-prices/${crop}`)
      const data = await response.json()
      if (data.success) {
        setMarketData(data)
      }
    } catch (error) {
      console.error('Error fetching market data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising':
        return <ArrowUp className="h-4 w-4 text-green-600" />
      case 'falling':
        return <ArrowDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'rising':
        return 'text-green-600'
      case 'falling':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Market Integration</h3>
      </div>

      {/* Crop Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Crop for Market Analysis
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {crops.map(crop => (
            <button
              key={crop.value}
              onClick={() => setSelectedCrop(crop.value)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedCrop === crop.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-2xl mb-1">{crop.icon}</div>
              <div className="text-sm font-medium">{crop.label}</div>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading market data...</p>
        </div>
      ) : marketData ? (
        <div className="space-y-6">
          {/* Current Price */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-green-900">Current Market Price</h4>
                <p className="text-3xl font-bold text-green-800">
                  ₹{marketData.prices.current}/kg
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  {getTrendIcon(marketData.prices.trend)}
                  <span className={`ml-1 font-medium ${getTrendColor(marketData.prices.trend)}`}>
                    {marketData.prices.trend}
                  </span>
                </div>
                <p className="text-sm text-green-700">Market Trend</p>
              </div>
            </div>
          </div>

          {/* Price Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-900 mb-3">Weekly Comparison</h5>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">This Week</p>
                  <p className="text-xl font-bold text-blue-800">₹{marketData.prices.weekly}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-700">Change</p>
                  <p className={`font-medium ${
                    marketData.prices.current > marketData.prices.weekly ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketData.prices.current > marketData.prices.weekly ? '+' : ''}
                    ₹{(marketData.prices.current - marketData.prices.weekly).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h5 className="font-semibold text-purple-900 mb-3">Monthly Comparison</h5>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">This Month</p>
                  <p className="text-xl font-bold text-purple-800">₹{marketData.prices.monthly}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-700">Change</p>
                  <p className={`font-medium ${
                    marketData.prices.current > marketData.prices.monthly ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketData.prices.current > marketData.prices.monthly ? '+' : ''}
                    ₹{(marketData.prices.current - marketData.prices.monthly).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-3">Market Insights</h5>
            <div className="space-y-2">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">
                  Current trend: <span className="font-medium capitalize">{marketData.prices.trend}</span>
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">
                  Price volatility: <span className="font-medium">Low to Medium</span>
                </span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm text-gray-700">
                  Best selling period: <span className="font-medium">Peak season</span>
                </span>
              </div>
            </div>
          </div>

          {/* Selling Recommendations */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-semibold text-yellow-900 mb-3">💡 Selling Recommendations</h5>
            <ul className="space-y-2">
              <li className="text-sm text-yellow-800 flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Monitor price trends daily for optimal selling timing
              </li>
              <li className="text-sm text-yellow-800 flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Consider local markets for better profit margins
              </li>
              <li className="text-sm text-yellow-800 flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Build relationships with local buyers for consistent sales
              </li>
              <li className="text-sm text-yellow-800 flex items-start">
                <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Consider organic certification for premium pricing
              </li>
            </ul>
          </div>

          {/* Data Timestamp */}
          <div className="text-center text-sm text-gray-500">
            Last updated: {new Date(marketData.timestamp).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No market data available</p>
        </div>
      )}
    </div>
  )
}
