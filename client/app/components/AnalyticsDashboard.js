'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

export default function AnalyticsDashboard({ data }) {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if (data && data.length > 0) {
      // Process data for charts
      const processedData = {
        diseases: data.map(item => ({
          name: item.disease_prediction,
          count: item.count,
          confidence: Math.round(item.avg_confidence * 100) / 100
        })),
        totalDetections: data.reduce((sum, item) => sum + item.count, 0),
        avgConfidence: Math.round(data.reduce((sum, item) => sum + item.avg_confidence, 0) / data.length * 100) / 100
      }
      setChartData(processedData)
    }
  }, [data])

  if (!chartData) {
    return (
      <div className="card">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Disease Analytics</h3>
        </div>
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No analytics data available yet</p>
          <p className="text-sm">Upload images to see disease statistics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Disease Analytics Dashboard</h3>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Total Detections</p>
              <p className="text-2xl font-bold text-blue-900">{chartData.totalDetections}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800">Avg Confidence</p>
              <p className="text-2xl font-bold text-green-900">{chartData.avgConfidence}%</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-orange-800">Disease Types</p>
              <p className="text-2xl font-bold text-orange-900">{chartData.diseases.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Distribution Chart */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Disease Distribution</h4>
        <div className="space-y-3">
          {chartData.diseases.slice(0, 5).map((disease, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-4 h-4 rounded-full bg-primary-500 mr-3"></div>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {disease.name}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{disease.count} cases</span>
                <span className="text-sm text-gray-500">{disease.confidence}% avg</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(disease.count / chartData.totalDetections) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Distribution */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Confidence Levels</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {chartData.diseases.filter(d => d.confidence >= 80).length}
            </div>
            <div className="text-sm text-gray-600">High (80%+)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {chartData.diseases.filter(d => d.confidence >= 60 && d.confidence < 80).length}
            </div>
            <div className="text-sm text-gray-600">Medium (60-79%)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {chartData.diseases.filter(d => d.confidence < 60).length}
            </div>
            <div className="text-sm text-gray-600">Low (&lt;60%)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
