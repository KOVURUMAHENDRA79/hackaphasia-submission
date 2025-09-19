'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Camera, Mail, MapPin } from 'lucide-react'

export default function ImageUpload({ onUpload, loading }) {
  const [userEmail, setUserEmail] = useState('')
  const [location, setLocation] = useState('')
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (preview && userEmail) {
      // Convert data URL back to file
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          const file = new File([blob], 'crop-image.jpg', { type: 'image/jpeg' })
          onUpload(file, userEmail, location)
        }, 'image/jpeg', 0.8)
      }
      
      img.src = preview
    }
  }

  return (
    <div className="space-y-6">
      {/* Image Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600">
              Click or drag to replace image
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Camera className="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop the image here' : 'Upload crop image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag & drop or click to select (max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User Information Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="h-4 w-4 inline mr-2" />
            Email Address (for notifications)
          </label>
          <input
            type="email"
            id="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="input-field"
            placeholder="farmer@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-2" />
            Location (optional)
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field"
            placeholder="City, Country"
          />
        </div>

        <button
          type="submit"
          disabled={!preview || !userEmail || loading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            !preview || !userEmail || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analyzing Image...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Upload className="h-5 w-5 mr-2" />
              Detect Disease
            </div>
          )}
        </button>
      </form>

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Take photos in good lighting conditions</li>
          <li>• Focus on affected leaves or plant parts</li>
          <li>• Ensure the image is clear and not blurry</li>
          <li>• Include multiple angles if possible</li>
        </ul>
      </div>
    </div>
  )
}
