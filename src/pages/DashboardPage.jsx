import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../context/TripContext'
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Plane,
  Building,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { user } = useAuth()
  const { trips } = useTrips()

  const upcomingTrips = trips
    .filter(trip => new Date(trip.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3)

  const recentTrips = trips
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Plan your next adventure with TripHub
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link 
          to="/trips/new"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Plus className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">New Trip</h3>
              <p className="text-sm text-gray-600">Start planning</p>
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">{trips.length}</h3>
              <p className="text-sm text-gray-600">Total Trips</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">
                {trips.reduce((acc, trip) => acc + trip.flights.length, 0)}
              </h3>
              <p className="text-sm text-gray-600">Flights Booked</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">
                {trips.reduce((acc, trip) => acc + trip.lodgings.length, 0)}
              </h3>
              <p className="text-sm text-gray-600">Hotels Booked</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Trips */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Trips</h2>
            <Link 
              to="/trips" 
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          {upcomingTrips.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming trips</p>
          ) : (
            <div className="space-y-3">
              {upcomingTrips.map((trip) => (
                <Link 
                  key={trip.id} 
                  to={`/trips/${trip.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{trip.name}</h3>
                      <p className="text-sm text-gray-600">{trip.destination}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(trip.startDate), 'MMM d')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Trips</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          {recentTrips.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500">No trips created yet</p>
              <Link 
                to="/trips/new"
                className="inline-block mt-2 text-primary-600 hover:text-primary-700"
              >
                Create your first trip
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTrips.map((trip) => (
                <Link 
                  key={trip.id} 
                  to={`/trips/${trip.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{trip.name}</h3>
                      <p className="text-sm text-gray-600">{trip.destination}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(trip.startDate), 'MMM d')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}