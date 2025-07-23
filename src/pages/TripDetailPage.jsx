import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import { 
  Calendar, 
  MapPin, 
  Plane, 
  Building, 
  Plus,
  ArrowLeft,
  Clock,
  DollarSign
} from 'lucide-react'
import { format } from 'date-fns'

export default function TripDetailPage() {
  const { id } = useParams()
  const { getTripById } = useTrips()
  
  const trip = getTripById(id)
  
  if (!trip) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Trip not found</h2>
        <Link to="/trips" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Back to trips
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link 
        to="/trips"
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to trips
      </Link>
      
      {/* Trip Header */}
      <div className="card mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
            <p className="text-gray-600 flex items-center mt-2">
              <MapPin className="w-5 h-5 mr-2" />
              {trip.destination}
            </p>
            <p className="text-gray-600 flex items-center mt-1">
              <Calendar className="w-5 h-5 mr-2" />
              {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Flights Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Plane className="w-5 h-5 mr-2 text-blue-600" />
              Flights ({trip.flights.length})
            </h2>
            <Link 
              to={`/trips/${trip.id}/flights`}
              className="btn-primary text-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Flight
            </Link>
          </div>
          
          {trip.flights.length === 0 ? (
            <div className="text-center py-8">
              <Plane className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No flights booked yet</p>
              <Link 
                to={`/trips/${trip.id}/flights`}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Search for flights
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {trip.flights.map((flight) => (
                <div key={flight.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {flight.departureAirport} → {flight.arrivalAirport}
                      </p>
                      <p className="text-sm text-gray-600">
                        {flight.airline} {flight.flightNumber}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(flight.departureDate), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 flex items-center">
                        <DollarSign className="w-4 h-4" />
                        {flight.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lodging Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2 text-green-600" />
              Lodging ({trip.lodgings.length})
            </h2>
            <Link 
              to={`/trips/${trip.id}/lodging`}
              className="btn-primary text-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Hotel
            </Link>
          </div>
          
          {trip.lodgings.length === 0 ? (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No lodging booked yet</p>
              <Link 
                to={`/trips/${trip.id}/lodging`}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                Search for hotels
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {trip.lodgings.map((lodging) => (
                <div key={lodging.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{lodging.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{lodging.type}</p>
                      <p className="text-sm text-gray-500">{lodging.address}</p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(lodging.checkInDate), 'MMM d')} - {format(new Date(lodging.checkOutDate), 'MMM d')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 flex items-center">
                        <DollarSign className="w-4 h-4" />
                        {lodging.pricePerNight}/night
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}