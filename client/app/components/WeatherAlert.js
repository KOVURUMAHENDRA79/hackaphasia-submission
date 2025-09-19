'use client'

import { AlertTriangle, Cloud, Thermometer, Droplets } from 'lucide-react'

export default function WeatherAlert({ weatherData }) {
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-danger-50 border-danger-200 text-danger-800'
      case 'medium':
        return 'bg-warning-50 border-warning-200 text-warning-800'
      default:
        return 'bg-success-50 border-success-200 text-success-800'
    }
  }

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-danger-600" />
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-warning-600" />
      default:
        return <Cloud className="h-5 w-5 text-success-600" />
    }
  }

  return (
    <div className={`rounded-lg border-2 p-4 mb-8 ${getRiskColor(weatherData.riskLevel)}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getRiskIcon(weatherData.riskLevel)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">
              Weather Risk Alert
            </h3>
            <span className="text-sm font-medium uppercase">
              {weatherData.riskLevel} Risk
            </span>
          </div>
          
          <p className="mb-3 text-sm">
            {weatherData.alertMessage}
          </p>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <Thermometer className="h-4 w-4 mr-1" />
              <span>{weatherData.temperature}°C</span>
            </div>
            <div className="flex items-center">
              <Droplets className="h-4 w-4 mr-1" />
              <span>{weatherData.humidity}% humidity</span>
            </div>
            <div className="flex items-center">
              <Cloud className="h-4 w-4 mr-1" />
              <span>{weatherData.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
