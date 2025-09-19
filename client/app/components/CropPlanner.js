'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Droplets, Sun, Thermometer } from 'lucide-react'

export default function CropPlanner() {
  const [selectedCrop, setSelectedCrop] = useState('rice')
  const [plannerData, setPlannerData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPlannerData(selectedCrop)
  }, [selectedCrop])

  const fetchPlannerData = async (crop) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/crop-planner/${crop}`)
      const data = await response.json()
      if (data.success) {
        setPlannerData(data.planner)
      }
    } catch (error) {
      console.error('Error fetching planner data:', error)
    } finally {
      setLoading(false)
    }
  }

  const crops = [
    { value: 'rice', label: 'Rice' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'maize', label: 'Maize' },
    { value: 'sugarcane', label: 'Sugarcane' },
    { value: 'cotton', label: 'Cotton' },
    { value: 'tomato', label: 'Tomato' },
    { value: 'potato', label: 'Potato' },
    { value: 'onion', label: 'Onion' },
    { value: 'chili', label: 'Chili' },
    { value: 'turmeric', label: 'Turmeric' },
    { value: 'ginger', label: 'Ginger' },
    { value: 'garlic', label: 'Garlic' },
    { value: 'cabbage', label: 'Cabbage' },
    { value: 'cauliflower', label: 'Cauliflower' },
    { value: 'brinjal', label: 'Brinjal' },
    { value: 'okra', label: 'Okra' },
    { value: 'cucumber', label: 'Cucumber' },
    { value: 'bottle gourd', label: 'Bottle Gourd' },
    { value: 'bitter gourd', label: 'Bitter Gourd' },
    { value: 'ridge gourd', label: 'Ridge Gourd' },
    { value: 'spinach', label: 'Spinach' },
    { value: 'coriander', label: 'Coriander' },
    { value: 'mint', label: 'Mint' },
    { value: 'fenugreek', label: 'Fenugreek' },
    { value: 'mustard', label: 'Mustard' },
    { value: 'sunflower', label: 'Sunflower' },
    { value: 'groundnut', label: 'Groundnut' },
    { value: 'sesame', label: 'Sesame' },
    { value: 'soybean', label: 'Soybean' },
    { value: 'chickpea', label: 'Chickpea' },
    { value: 'lentil', label: 'Lentil' },
    { value: 'black gram', label: 'Black Gram' },
    { value: 'green gram', label: 'Green Gram' },
    { value: 'pigeon pea', label: 'Pigeon Pea' },
    { value: 'mango', label: 'Mango' },
    { value: 'banana', label: 'Banana' },
    { value: 'papaya', label: 'Papaya' },
    { value: 'guava', label: 'Guava' },
    { value: 'pomegranate', label: 'Pomegranate' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'orange', label: 'Orange' },
    { value: 'lemon', label: 'Lemon' },
    { value: 'coconut', label: 'Coconut' },
    { value: 'cashew', label: 'Cashew' },
    { value: 'almond', label: 'Almond' },
    { value: 'walnut', label: 'Walnut' },
    { value: 'cardamom', label: 'Cardamom' },
    { value: 'pepper', label: 'Pepper' },
    { value: 'cinnamon', label: 'Cinnamon' },
    { value: 'clove', label: 'Clove' },
    { value: 'nutmeg', label: 'Nutmeg' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <Calendar className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Crop Management Planner</h3>
      </div>

      {/* Crop Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Crop
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="input-field"
        >
          {crops.map(crop => (
            <option key={crop.value} value={crop.value}>
              {crop.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading planner data...</p>
        </div>
      ) : plannerData ? (
        <div className="space-y-6">
          {/* Planting Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-green-900 mb-3">🌱 Planting Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Best Month</p>
                  <p className="text-green-900">{plannerData.planting.month}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Temperature</p>
                  <p className="text-green-900">{plannerData.planting.temperature}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Sun className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Soil Type</p>
                  <p className="text-green-900">{plannerData.planting.soil}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Growing Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">🌿 Growing Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Duration</p>
                  <p className="text-blue-900">{plannerData.growing.duration}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Watering</p>
                  <p className="text-blue-900">{plannerData.growing.watering}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Sun className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Fertilizing</p>
                  <p className="text-blue-900">{plannerData.growing.fertilizing}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Harvesting Information */}
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-orange-900 mb-3">🍅 Harvesting Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Harvest Month</p>
                  <p className="text-orange-900">{plannerData.harvesting.month}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Sun className="h-5 w-5 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Harvest Indicators</p>
                  <p className="text-orange-900">{plannerData.harvesting.indicators}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Tasks */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-purple-900 mb-3">🔧 Maintenance Tasks</h4>
            <ul className="space-y-2">
              {plannerData.maintenance.map((task, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-purple-800">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Monthly Schedule */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">📅 Monthly Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plannerData.schedule.map((month, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border">
                  <h5 className="font-semibold text-gray-900 mb-2">{month.month}</h5>
                  <ul className="space-y-1">
                    {month.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No planner data available</p>
        </div>
      )}
    </div>
  )
}
