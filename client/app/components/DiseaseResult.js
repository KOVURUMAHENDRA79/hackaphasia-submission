'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, Leaf, Clock } from 'lucide-react'

export default function DiseaseResult({ result }) {
  const [displayResult, setDisplayResult] = useState(result)

  useEffect(() => {
    setDisplayResult(result)
  }, [result])

  const getDiseaseStatus = (disease, severity) => {
    if (disease.toLowerCase().includes('healthy')) {
      return { status: 'healthy', color: 'text-success-600', bgColor: 'bg-success-50', icon: 'CheckCircle' }
    } else if (severity === 'high') {
      return { status: 'critical', color: 'text-danger-600', bgColor: 'bg-danger-50', icon: 'AlertTriangle' }
    } else if (severity === 'moderate') {
      return { status: 'warning', color: 'text-warning-600', bgColor: 'bg-warning-50', icon: 'AlertTriangle' }
    } else {
      return { status: 'disease', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: 'AlertTriangle' }
    }
  }

  const diseaseStatus = getDiseaseStatus(displayResult?.disease || '', displayResult?.severity)

  if (!displayResult) return null

  return (
    <div className="space-y-6">

      {/* Disease Detection Result */}
      <div className={`rounded-lg p-4 ${diseaseStatus.bgColor}`}>
        <div className="flex items-center mb-3">
          {diseaseStatus.status === 'healthy' ? (
            <CheckCircle className="h-6 w-6 text-success-600 mr-3" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-danger-600 mr-3" />
          )}
          <h4 className="text-lg font-semibold text-gray-900">Detection Result</h4>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Disease:</span>
            <span className={`font-semibold ${diseaseStatus.color}`}>
              {displayResult.disease}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Confidence:</span>
            <span className="font-semibold text-gray-900">
              {displayResult.confidence}%
            </span>
          </div>

          {displayResult.severity && displayResult.severity !== 'none' && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Severity:</span>
              <span className={`font-semibold ${
                displayResult.severity === 'high' ? 'text-danger-600' :
                displayResult.severity === 'moderate' ? 'text-warning-600' :
                'text-blue-600'
              }`}>
                {displayResult.severity.charAt(0).toUpperCase() + displayResult.severity.slice(1)}
              </span>
            </div>
          )}

          {displayResult.treatment?.urgency && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Urgency:</span>
              <span className={`font-semibold ${
                displayResult.treatment.urgency.includes('immediately') ? 'text-danger-600' :
                displayResult.treatment.urgency.includes('within') ? 'text-warning-600' :
                'text-blue-600'
              }`}>
                {displayResult.treatment.urgency}
              </span>
            </div>
          )}
        </div>

        {/* Confidence Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                displayResult.confidence >= 80
                  ? 'bg-success-500'
                  : displayResult.confidence >= 60
                  ? 'bg-warning-500'
                  : 'bg-danger-500'
              }`}
              style={{ width: `${displayResult.confidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Treatment Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Leaf className="h-5 w-5 text-primary-600 mr-2" />
          <h4 className="text-lg font-semibold text-gray-900">Treatment Recommendations</h4>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h5 className="font-medium text-green-900 mb-2">🌱 Organic Treatment</h5>
          <p className="text-green-800 text-sm leading-relaxed">
            {displayResult.treatment.organic}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">🛡️ Prevention</h5>
          <p className="text-blue-800 text-sm leading-relaxed">
            {displayResult.treatment.prevention}
          </p>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-700">Analysis Time</span>
        </div>
        <p className="text-sm text-gray-600">
          Detection completed in real-time using AI models trained on thousands of crop images.
        </p>
      </div>

    </div>
  )
}
