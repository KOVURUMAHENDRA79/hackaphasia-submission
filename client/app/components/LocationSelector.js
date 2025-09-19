'use client'

import { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'

export default function LocationSelector({ onLocationChange, currentLocation = 'mumbai' }) {
  const [selectedState, setSelectedState] = useState('Maharashtra')
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  const [isOpen, setIsOpen] = useState(false)

  const indianStates = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kadapa', 'Anantapur'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Namsai', 'Ziro', 'Along', 'Bomdila'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Dhubri'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Arrah', 'Begusarai'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Durg', 'Raigarh', 'Ambikapur'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Mormugao', 'Curchorem', 'Sanquelim'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Karnal', 'Hisar', 'Rohtak'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Kullu', 'Manali', 'Chamba'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Phusro'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Palakkad', 'Malappuram', 'Kannur', 'Kollam'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati', 'Ukhrul', 'Tamenglong', 'Chandel'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara', 'Nongpoh', 'Mairang'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Lawngtlai', 'Mamit'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Kiphire'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bharatpur', 'Alwar'],
    'Sikkim': ['Gangtok', 'Namchi', 'Mangan', 'Gyalshing', 'Ravangla', 'Lachung', 'Lachen', 'Pelling'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Nalgonda'],
    'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Ambassa', 'Kailashahar', 'Belonia', 'Khowai', 'Teliamura'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Ghaziabad'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Roorkee', 'Kashipur', 'Rudrapur', 'Haldwani', 'Nainital'],
    'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Baharampur', 'Habra']
  }

  const handleStateChange = (state) => {
    setSelectedState(state)
    setSelectedCity(indianStates[state][0])
    onLocationChange(indianStates[state][0].toLowerCase())
  }

  const handleCityChange = (city) => {
    setSelectedCity(city)
    onLocationChange(city.toLowerCase())
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <MapPin className="h-5 w-5 text-primary-600 mr-2" />
        <label className="text-sm font-medium text-gray-700">Select Location</label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State Selection */}
        <div className="relative">
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
          >
            {Object.keys(indianStates).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* City Selection */}
        <div className="relative">
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
          >
            {indianStates[selectedState]?.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
