import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, Plus, ShoppingCart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAdmin, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <span className="text-2xl">🌱</span>
            <span className="text-2xl font-bold text-primary-600">Urvann</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            
            {isAuthenticated() && isAdmin() && (
              <Link 
                to="/add-plant" 
                className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Plant</span>
              </Link>
            )}

            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {user?.fullName}
                    {isAdmin() && (
                      <span className="ml-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <Link
                to="/"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              >
                Home
              </Link>

              {isAuthenticated() && isAdmin() && (
                <Link
                  to="/add-plant"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Plant</span>
                </Link>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated() ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2 text-gray-700">
                      <User className="h-5 w-5" />
                      <div>
                        <div className="text-sm font-medium">{user?.fullName}</div>
                        {isAdmin() && (
                          <div className="text-xs text-primary-600">Admin</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar