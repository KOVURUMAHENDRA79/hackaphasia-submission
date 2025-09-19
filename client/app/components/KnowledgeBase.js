'use client'

import { useState } from 'react'
import { BookOpen, Search, AlertTriangle, Shield, Lightbulb } from 'lucide-react'
import DiseaseSelector from './DiseaseSelector'

export default function KnowledgeBase({ data }) {
  const [activeTab, setActiveTab] = useState('diseases')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDisease, setSelectedDisease] = useState('')

  if (!data) {
    return (
      <div className="card">
        <div className="flex items-center mb-6">
          <BookOpen className="h-6 w-6 text-primary-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Knowledge Base</h3>
        </div>
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Loading knowledge base...</p>
        </div>
      </div>
    )
  }

  // Generate data based on selected disease
  const generateDiseaseData = (diseaseName) => {
    if (!diseaseName) return { diseases: [], treatments: [], tips: [] }
    
    const diseaseData = {
      name: diseaseName,
      description: `Comprehensive information about ${diseaseName} including symptoms, prevention, and treatment methods.`,
      symptoms: [
        'Yellowing of leaves',
        'Brown spots on foliage',
        'Wilting and drooping',
        'Stunted growth',
        'Fungal growth on affected areas'
      ],
      prevention: [
        'Maintain proper spacing between plants',
        'Ensure good air circulation',
        'Avoid overhead watering',
        'Use disease-resistant varieties',
        'Practice crop rotation'
      ],
      treatment: [
        'Remove infected plant parts immediately',
        'Apply organic fungicide spray',
        'Improve soil drainage',
        'Use neem oil treatment',
        'Apply copper-based fungicides'
      ]
    }

    const treatmentData = {
      name: `${diseaseName} Treatment`,
      description: `Effective treatment methods for ${diseaseName}`,
      usage: 'Apply every 7-10 days during active disease period',
      safety: 'Safe for organic farming, follow label instructions'
    }

    const tipsData = [
      `Early detection is key for ${diseaseName} management`,
      `Monitor plants regularly for disease symptoms`,
      `Maintain proper plant nutrition to boost immunity`,
      `Use clean tools to prevent disease spread`,
      `Remove plant debris to reduce disease pressure`
    ]

    return {
      diseases: [diseaseData],
      treatments: [treatmentData],
      tips: tipsData
    }
  }

  const selectedDiseaseData = generateDiseaseData(selectedDisease)
  const filteredDiseases = selectedDiseaseData.diseases
  const filteredTreatments = selectedDiseaseData.treatments
  const filteredTips = selectedDiseaseData.tips

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <BookOpen className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Knowledge Base</h3>
      </div>

      {/* Disease Selection */}
      <div className="mb-6">
        <DiseaseSelector 
          onDiseaseChange={setSelectedDisease}
          currentDisease={selectedDisease}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('diseases')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'diseases'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          Diseases
        </button>
        <button
          onClick={() => setActiveTab('treatments')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'treatments'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Treatments
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tips'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="h-4 w-4 inline mr-2" />
          Tips
        </button>
      </div>

      {/* Tab Content */}
      {!selectedDisease ? (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Please select a disease from the dropdown above to view information</p>
        </div>
      ) : activeTab === 'diseases' && (
        <div className="space-y-4">
          {filteredDiseases.length > 0 ? (
            filteredDiseases.map((disease, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{disease.name}</h4>
                <p className="text-gray-600 mb-3">{disease.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium text-red-800 mb-2">Symptoms</h5>
                    <ul className="space-y-1">
                      {disease.symptoms.map((symptom, i) => (
                        <li key={i} className="text-sm text-red-700 flex items-center">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Prevention</h5>
                    <ul className="space-y-1">
                      {disease.prevention.map((prevention, i) => (
                        <li key={i} className="text-sm text-green-700 flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {prevention}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Treatment</h5>
                    <ul className="space-y-1">
                      {disease.treatment.map((treatment, i) => (
                        <li key={i} className="text-sm text-blue-700 flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {treatment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No diseases found matching your search</p>
            </div>
          )}
        </div>
      )}

      {selectedDisease && activeTab === 'treatments' && (
        <div className="space-y-4">
          {filteredTreatments.length > 0 ? (
            filteredTreatments.map((treatment, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{treatment.name}</h4>
                <p className="text-gray-600 mb-3">{treatment.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Usage Instructions</h5>
                    <p className="text-sm text-blue-700">{treatment.usage}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Safety Information</h5>
                    <p className="text-sm text-green-700">{treatment.safety}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No treatments found matching your search</p>
            </div>
          )}
        </div>
      )}

      {selectedDisease && activeTab === 'tips' && (
        <div className="space-y-4">
          {filteredTips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTips.map((tip, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-800">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No tips found matching your search</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
