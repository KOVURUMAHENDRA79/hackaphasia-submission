'use client'

import { useState } from 'react'
import { Brain, AlertTriangle, TrendingUp, Clock, Target } from 'lucide-react'

export default function AIPredictions({ weatherData, predictedDisease = '' }) {
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    disease: predictedDisease,
    cropType: 'Rice',
    location: 'Mumbai'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/ai-predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          weather: weatherData
        }),
      })

      const data = await response.json()
      if (data.success) {
        setPredictions(data.predictions)
      }
    } catch (error) {
      console.error('AI prediction error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getRiskColor = (risk) => {
    if (risk >= 0.7) return 'text-red-600 bg-red-50'
    if (risk >= 0.4) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getRiskLabel = (risk) => {
    if (risk >= 0.7) return 'High Risk'
    if (risk >= 0.4) return 'Medium Risk'
    return 'Low Risk'
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <Brain className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Advanced AI Predictions</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disease
            </label>
            <input
              type="text"
              name="disease"
              value={formData.disease}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., Tomato Late Blight"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop Type
            </label>
            <select
              name="cropType"
              value={formData.cropType}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Maize">Maize</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Cotton">Cotton</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Onion">Onion</option>
              <option value="Chili">Chili</option>
              <option value="Turmeric">Turmeric</option>
              <option value="Ginger">Ginger</option>
              <option value="Garlic">Garlic</option>
              <option value="Cabbage">Cabbage</option>
              <option value="Cauliflower">Cauliflower</option>
              <option value="Brinjal">Brinjal</option>
              <option value="Okra">Okra</option>
              <option value="Cucumber">Cucumber</option>
              <option value="Bottle Gourd">Bottle Gourd</option>
              <option value="Bitter Gourd">Bitter Gourd</option>
              <option value="Ridge Gourd">Ridge Gourd</option>
              <option value="Spinach">Spinach</option>
              <option value="Coriander">Coriander</option>
              <option value="Mint">Mint</option>
              <option value="Fenugreek">Fenugreek</option>
              <option value="Mustard">Mustard</option>
              <option value="Sunflower">Sunflower</option>
              <option value="Groundnut">Groundnut</option>
              <option value="Sesame">Sesame</option>
              <option value="Soybean">Soybean</option>
              <option value="Chickpea">Chickpea</option>
              <option value="Lentil">Lentil</option>
              <option value="Black Gram">Black Gram</option>
              <option value="Green Gram">Green Gram</option>
              <option value="Pigeon Pea">Pigeon Pea</option>
              <option value="Mango">Mango</option>
              <option value="Banana">Banana</option>
              <option value="Papaya">Papaya</option>
              <option value="Guava">Guava</option>
              <option value="Pomegranate">Pomegranate</option>
              <option value="Grapes">Grapes</option>
              <option value="Orange">Orange</option>
              <option value="Lemon">Lemon</option>
              <option value="Coconut">Coconut</option>
              <option value="Cashew">Cashew</option>
              <option value="Almond">Almond</option>
              <option value="Walnut">Walnut</option>
              <option value="Cardamom">Cardamom</option>
              <option value="Pepper">Pepper</option>
              <option value="Cinnamon">Cinnamon</option>
              <option value="Clove">Clove</option>
              <option value="Nutmeg">Nutmeg</option>
              <option value="Vanilla">Vanilla</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., New York"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'Generating Predictions...' : 'Generate AI Predictions'}
        </button>
      </form>

      {predictions && (
        <div className="space-y-6">
          {/* Risk Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`rounded-lg p-4 ${getRiskColor(predictions.diseaseRisk)}`}>
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3" />
                <div>
                  <p className="text-sm font-medium">Disease Risk</p>
                  <p className="text-xl font-bold">{getRiskLabel(predictions.diseaseRisk)}</p>
                  <p className="text-sm opacity-75">{Math.round(predictions.diseaseRisk * 100)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Spread Probability</p>
                  <p className="text-xl font-bold text-blue-900">
                    {Math.round(predictions.spreadProbability * 100)}%
                  </p>
                  <p className="text-sm text-blue-700 opacity-75">Likelihood of spread</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <Target className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Treatment Effectiveness</p>
                  <p className="text-xl font-bold text-green-900">
                    {Math.round(predictions.treatmentEffectiveness * 100)}%
                  </p>
                  <p className="text-sm text-green-700 opacity-75">Expected success rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-purple-900 mb-3">🤖 AI Recommendations</h4>
            <ul className="space-y-2">
              {predictions.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-purple-800 flex items-start">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>

          {/* Treatment Timeline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">📅 Treatment Timeline</h4>
            <div className="space-y-3">
              {predictions.timeline.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      item.priority === 'high' ? 'bg-red-500' :
                      item.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-600">Day {item.day}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.priority === 'high' ? 'bg-red-100 text-red-800' :
                    item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.priority} priority
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Score */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-semibold text-blue-900">AI Confidence Score</h5>
                <p className="text-sm text-blue-700">Overall prediction reliability</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">
                  {Math.round(predictions.confidence * 100)}%
                </p>
                <div className="w-20 bg-blue-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${predictions.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
