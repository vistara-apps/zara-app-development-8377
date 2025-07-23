import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'

export default function CreateTripPage() {
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const { createTrip } = useTrips()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!name || !destination || !startDate || !endDate) {
      setError('All fields are required')
      return
    }
    
    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date')
      return
    }
    
    try {
      const newTrip = createTrip({
        name,
        destination,
        startDate,
        endDate
      })
      navigate(`/trips/${newTrip.id}`)
    } catch (err) {
      setError('Failed to create trip')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>
      
      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Trip</h1>
          <p className="mt-2 text-gray-600">
            Start planning your next adventure
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Trip Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input mt-1"
              placeholder="e.g., Summer Vacation 2024"
            />
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Destination
              </div>
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input mt-1"
              placeholder="e.g., Paris, France"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Start Date
                </div>
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  End Date
                </div>
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input mt-1"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              Create Trip
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}