'use client'

import { useState } from 'react'
import { Calculator, DollarSign, TrendingDown, AlertCircle } from 'lucide-react'

export default function EconomicCalculator({ predictedDisease = '' }) {
  const [formData, setFormData] = useState({
    disease: predictedDisease,
    cropType: 'Rice',
    farmSize: '',
    currentYield: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/economic-impact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        setResult(data)
      }
    } catch (error) {
      console.error('Economic calculation error:', error)
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

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Economic Impact Calculator</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disease Detected
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
            Farm Size (acres)
          </label>
          <input
            type="number"
            name="farmSize"
            value={formData.farmSize}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., 10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Yield (tons/acre)
          </label>
          <input
            type="number"
            step="0.1"
            name="currentYield"
            value={formData.currentYield}
            onChange={handleInputChange}
            className="input-field"
            placeholder="e.g., 5.5"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? 'Calculating...' : 'Calculate Impact'}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Economic Impact Analysis</h4>
            
            {/* Impact Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center">
                  <TrendingDown className="h-6 w-6 text-red-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Yield Loss</p>
                    <p className="text-xl font-bold text-red-900">{result.yieldLoss}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Revenue Loss</p>
                    <p className="text-xl font-bold text-blue-900">${result.revenueLoss}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Current Yield:</span>
                <span className="font-medium">{result.currentYield} tons/acre</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Potential Yield:</span>
                <span className="font-medium">{result.potentialYield} tons/acre</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Yield Loss Amount:</span>
                <span className="font-medium text-red-600">{result.yieldLossAmount} tons/acre</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Market Price:</span>
                <span className="font-medium">${result.basePrice}/ton</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Treatment Cost:</span>
                <span className="font-medium text-orange-600">${result.treatmentCost}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Net Loss:</span>
                <span className="font-bold text-red-600">${result.netLoss}</span>
              </div>
            </div>

            {/* ROI Information */}
            {result.roi && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">
                    Treatment ROI: {result.roi > 0 ? '+' : ''}{result.roi}%
                  </span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  {result.roi > 0 
                    ? 'Treatment is economically beneficial'
                    : 'Treatment costs exceed potential savings'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
