import React, { createContext, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from './AuthContext'

const TripContext = createContext()

export function useTrips() {
  const context = useContext(TripContext)
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider')
  }
  return context
}

export function TripProvider({ children }) {
  const { user } = useAuth()
  const [trips, setTrips] = useState([])

  const createTrip = (tripData) => {
    const newTrip = {
      id: uuidv4(),
      userId: user.id,
      ...tripData,
      flights: [],
      lodgings: [],
      activities: [],
      createdAt: new Date().toISOString()
    }
    setTrips(prev => [...prev, newTrip])
    return newTrip
  }

  const updateTrip = (tripId, updates) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, ...updates } : trip
    ))
  }

  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId))
  }

  const addFlightToTrip = (tripId, flight) => {
    const flightWithId = { ...flight, id: uuidv4() }
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, flights: [...trip.flights, flightWithId] }
        : trip
    ))
  }

  const addLodgingToTrip = (tripId, lodging) => {
    const lodgingWithId = { ...lodging, id: uuidv4() }
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, lodgings: [...trip.lodgings, lodgingWithId] }
        : trip
    ))
  }

  const addActivityToTrip = (tripId, activity) => {
    const activityWithId = { ...activity, id: uuidv4() }
    setTrips(prev => prev.map(trip => 
      trip.id === tripId 
        ? { ...trip, activities: [...trip.activities, activityWithId] }
        : trip
    ))
  }

  const getUserTrips = () => {
    return trips.filter(trip => trip.userId === user?.id)
  }

  const getTripById = (tripId) => {
    return trips.find(trip => trip.id === tripId)
  }

  const value = {
    trips: getUserTrips(),
    createTrip,
    updateTrip,
    deleteTrip,
    addFlightToTrip,
    addLodgingToTrip,
    addActivityToTrip,
    getTripById
  }

  return (
    <TripContext.Provider value={value}>
      {children}
    </TripContext.Provider>
  )
}