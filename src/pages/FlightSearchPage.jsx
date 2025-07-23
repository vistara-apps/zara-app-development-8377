import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import { ArrowLeft, Plane, Search, Clock, DollarSign } from 'lucide-react'

// Mock flight data for demonstration
const mockFlights = [
  {
    departureAirport: 'JFK',
    arrivalAirport: 'CDG',
    departureDate: '2024-07-15T08:00:00',
    arrivalDate: '2024-07-15T21:00:00',
    airline: 'Air France',
    flightNumber: 'AF007',
    price: 850,
    duration: '7h 45m'
  },
  {
    departureAirport: 'JFK',
    arrivalAirport: 'CDG',
    departureDate: '2024-07-15T14:30:00',
    arrivalDate: '2024-07-16T03:15:00',
    airline: 'Delta',
    flightNumber: 'DL163',
    price: 920,
    duration: '7h 15m'
  },
  {
    departureAirport: 'JFK',
    arrivalAirport: 'CDG',
    departureDate: '2024-07-15T22:00:00',
    arrivalDate: '2024-07-16T11:30:00',
    airline: 'American',
    flightNumber: 'AA136',
    price: 780,
    duration: '7h 30m'
  }
]

export default function FlightSearchPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTripById, addFlightToTrip } = useTrips()
  const [departureAirport, setDepartureAirport] = useState('JFK')
  const [arrivalAirport, setArrivalAirport] = useState('CDG')
  const [departureDate, setDepartureDate] = useState('2024-07-15')
  const [flights, setFlights] = useState([])
  const [searching, setSearching] = useState(false)
  
  const trip = getTripById(id)
  
  if (!trip) {
    return <div>Trip not found</div>
  }

  const searchFlights = () => {
    setSearching(true)
    // Mock API call
    setTimeout(() => {
      setFlights(mockFlights)
      setSearching(false)
    }, 1000)
  }

  const bookFlight = (flight) => {
    addFlightToTrip(trip.id, {
      ...flight,
      departureDate: departureDate + 'T' + flight.departureDate.split('T')[1],
      arrivalDate: departureDate + 'T' + flight.arrivalDate.split('T')[1]
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
          <Plane className="w-6 h-6 mr-3 text-blue-600" />
          Search Flights
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="text"
              value={departureAirport}
              onChange={(e) => setDepartureAirport(e.target.value)}
              className="input"
              placeholder="Departure airport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="text"
              value={arrivalAirport}
              onChange={(e) => setArrivalAirport(e.target.value)}
              className="input"
              placeholder="Arrival airport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={searchFlights}
              disabled={searching}
              className="btn-primary w-full flex items-center justify-center"
            >
              <Search className="w-4 h-4 mr-2" />
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {flights.length > 0 && (
        <div className="space-y-4">
          {flights.map((flight, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="text-lg font-semibold text-gray-900">
                      {flight.departureAirport}
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-full h-px bg-gray-300 relative">
                        <Plane className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {flight.arrivalAirport}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">{flight.airline}</span>
                      <span className="ml-1">{flight.flightNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {flight.duration}
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-2xl font-bold text-gray-900 flex items-center justify-end">
                    <DollarSign className="w-5 h-5" />
                    {flight.price}
                  </div>
                  <button
                    onClick={() => bookFlight(flight)}
                    className="btn-primary mt-2"
                  >
                    Book Flight
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {flights.length === 0 && !searching && (
        <div className="text-center py-12">
          <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Search for flights to see available options</p>
        </div>
      )}
    </div>
  )
}