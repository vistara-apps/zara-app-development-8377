import React from 'react'
import { Link } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Plane,
  Building,
  MoreVertical 
} from 'lucide-react'
import { format } from 'date-fns'

export default function TripsPage() {
  const { trips, deleteTrip } = useTrips()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="mt-2 text-gray-600">
            Manage all your travel plans in one place
          </p>
        </div>
        <Link to="/trips/new" className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600 mb-6">
            Start planning your next adventure by creating your first trip.
          </p>
          <Link to="/trips/new" className="btn-primary">
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{trip.name}</h3>
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {trip.destination}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Plane className="w-4 h-4 mr-1 text-blue-500" />
                    {trip.flights.length} flights
                  </div>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1 text-green-500" />
                    {trip.lodgings.length} hotels
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link 
                  to={`/trips/${trip.id}`}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-3 rounded text-center transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this trip?')) {
                      deleteTrip(trip.id)
                    }
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium py-2 px-3 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}