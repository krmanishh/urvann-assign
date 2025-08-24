import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const PlantCard = ({ plant }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async (e) => {
    e.preventDefault() // Prevent navigation when clicking the button
    
    if (!isAuthenticated()) {
      alert('Please login to add items to cart')
      return
    }

    setIsLoading(true)
    try {
      // Add to cart logic here
      console.log('Adding to cart:', plant._id)
      // You can implement cart API call here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="plant-card group">
      <Link to={`/plant/${plant._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-w-4 aspect-h-3 bg-gray-100 overflow-hidden">
          {plant.imageUrl && !imageError ? (
            <img
              src={plant.imageUrl}
              alt={plant.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-6xl animate-pulse">🌱</span>
            </div>
          )}
          
          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              plant.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {plant.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Plant Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {plant.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(plant.price)}
            </span>
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm text-gray-600">4.5</span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-3">
            {plant.categories?.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-800 transition-colors"
              >
                {category}
              </span>
            ))}
            {plant.categories?.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                +{plant.categories.length - 3}
              </span>
            )}
          </div>

          {/* Description */}
          {plant.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {plant.description}
            </p>
          )}
        </div>
      </Link>

      {/* Action Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!plant.inStock || isLoading}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            plant.inStock 
              ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md active:scale-95 disabled:opacity-50' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>{plant.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default PlantCard