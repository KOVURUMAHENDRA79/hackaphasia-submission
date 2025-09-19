'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

export default function DiseaseSelector({ onDiseaseChange, currentDisease = '' }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const diseases = [
    'Apple Scab', 'Apple Rust', 'Tomato Late Blight', 'Tomato Early Blight', 'Tomato Bacterial Spot',
    'Corn Common Rust', 'Corn Northern Leaf Blight', 'Grape Black Rot', 'Grape Esca', 'Grape Leaf Blight',
    'Potato Early Blight', 'Potato Late Blight', 'Rice Blast', 'Rice Brown Spot', 'Rice Sheath Blight',
    'Wheat Rust', 'Wheat Powdery Mildew', 'Wheat Septoria', 'Maize Rust', 'Maize Gray Leaf Spot',
    'Sugarcane Red Rot', 'Sugarcane Smut', 'Cotton Bacterial Blight', 'Cotton Verticillium Wilt',
    'Onion Downy Mildew', 'Onion Purple Blotch', 'Chili Anthracnose', 'Chili Bacterial Wilt',
    'Turmeric Leaf Spot', 'Turmeric Rhizome Rot', 'Ginger Soft Rot', 'Ginger Bacterial Wilt',
    'Garlic Rust', 'Garlic White Rot', 'Cabbage Black Rot', 'Cabbage Club Root',
    'Cauliflower Downy Mildew', 'Cauliflower Black Rot', 'Brinjal Fruit Rot', 'Brinjal Bacterial Wilt',
    'Okra Yellow Vein Mosaic', 'Okra Powdery Mildew', 'Cucumber Downy Mildew', 'Cucumber Powdery Mildew',
    'Bottle Gourd Anthracnose', 'Bitter Gourd Powdery Mildew', 'Ridge Gourd Downy Mildew',
    'Spinach Downy Mildew', 'Coriander Damping Off', 'Mint Rust', 'Fenugreek Powdery Mildew',
    'Mustard Alternaria Blight', 'Sunflower Downy Mildew', 'Groundnut Rust', 'Sesame Bacterial Blight',
    'Soybean Rust', 'Chickpea Ascochyta Blight', 'Lentil Rust', 'Black Gram Yellow Mosaic',
    'Green Gram Powdery Mildew', 'Pigeon Pea Wilt', 'Mango Anthracnose', 'Mango Powdery Mildew',
    'Banana Sigatoka', 'Banana Panama Disease', 'Papaya Anthracnose', 'Guava Anthracnose',
    'Pomegranate Bacterial Blight', 'Grapes Downy Mildew', 'Orange Citrus Canker', 'Lemon Greening',
    'Coconut Bud Rot', 'Cashew Anthracnose', 'Almond Shot Hole', 'Walnut Blight',
    'Cardamom Mosaic', 'Pepper Foot Rot', 'Cinnamon Leaf Spot', 'Clove Dieback',
    'Nutmeg Fruit Rot', 'Vanilla Root Rot'
  ]

  const filteredDiseases = diseases.filter(disease =>
    disease.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDiseaseSelect = (disease) => {
    onDiseaseChange(disease)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <div className="flex items-center mb-2">
        <Search className="h-5 w-5 text-primary-600 mr-2" />
        <label className="text-sm font-medium text-gray-700">Select Disease</label>
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search diseases..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredDiseases.length > 0 ? (
              filteredDiseases.map((disease, index) => (
                <button
                  key={index}
                  onClick={() => handleDiseaseSelect(disease)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {disease}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No diseases found</div>
            )}
          </div>
        )}
      </div>
      
      {currentDisease && (
        <div className="mt-2 p-2 bg-primary-50 rounded-lg">
          <span className="text-sm font-medium text-primary-800">Selected: {currentDisease}</span>
        </div>
      )}
    </div>
  )
}
