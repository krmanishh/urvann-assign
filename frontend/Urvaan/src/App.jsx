import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import AddPlant from './pages/AddPlant'
import PlantDetails from './pages/PlantDetails'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
    </div>
  )
}

export default App