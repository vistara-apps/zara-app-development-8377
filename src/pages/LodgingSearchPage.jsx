import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import { ArrowLeft, Building, Search, MapPin, Star, DollarSign } from 'lucide-react'

// Mock lodging data for demonstration
const mockLodgings = [
  {
    name: 'Hotel de Luxe Paris',
    type: 'hotel',
    address: '123 Champs-Élysées, Paris',
    pricePerNight: 250,
    rating: 4.5,
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant']
  },
  {
    name: 'Boutique Hotel Marais',
    type: 'hotel',
    address: '456 Rue du Marais, Paris',
    pricePerNight: 180,
    rating: 4.2,
    amenities: ['WiFi', 'Breakfast', 'Concierge']
  },
  {
    name: 'Cozy Apartment Near Louvre',
    type: 'apartment',
    address: '789 Rue de Rivoli, Paris',
    pricePerNight: 120,
    rating: 4.8,
    amenities: ['WiFi', 'Kitchen', 'Washer']
  }
]

export default function LodgingSearchPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTripById, addLodgingToTrip } = useTrips()
  const [location, setLocation] = useState('Paris, France')
  const [checkInDate, setCheckInDate] = useState('2024-07-15')
  const [checkOutDate, setCheckOutDate] = useState('2024-07-20')
  const [lodgings, setLodgings] = useState([])
  const [searching, setSearching] = useState(false)
  
  const trip = getTripById(id)
  
  if (!trip) {
    return <div>Trip not found</div>
  }

  const searchLodgings = () => {
    setSearching(true)
    // Mock API call
    setTimeout(() => {
      setLodgings(mockLodgings)
      setSearching(false)
    }, 1000)
  }

  const bookLodging = (lodging) => {
    addLodgingToTrip(trip.id, {
      ...lodging,
      checkInDate,
      checkOutDate
    })
    navigate(`/trips/${trip.id}`)
  }

  return (
    <div>
      <Link 
        to={`/trips/${trip.id}`}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {trip.name}
      </Link>
      
      <div className="card mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Building className="w-6 h-6 mr-3 text-green-600" />
          Search Hotels & Lodging
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={searchLodgings}
              disabled={searching}
              className="btn-primary w-full flex items-center justify-center"
            >
              <Search className="w-4 h-4 mr-2" />
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {lodgings.length > 0 && (
        <div className="space-y-4">
          {lodgings.map((lodging, index) => (
            <div key={index} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{lodging.name}</h3>
                      <p className="text-sm text-gray-600 capitalize flex items-center mt-1">
                        <Building className="w-4 h-4 mr-1" />
                        {lodging.type}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{lodging.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 flex items-center mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {lodging.address}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {lodging.amenities.map((amenity) => (
                      <span 
                        key={amenity}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-2xl font-bold text-gray-900 flex items-center justify-end">
                    <DollarSign className="w-5 h-5" />
                    {lodging.pricePerNight}
                    <span className="text-sm font-normal text-gray-600 ml-1">/night</span>
                  </div>
                  <button
                    onClick={() => bookLodging(lodging)}
                    className="btn-primary mt-2"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {lodgings.length === 0 && !searching && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Search for hotels and lodging to see available options</p>
        </div>
      )}
    </div>
  )
}