import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { plantApi } from '../api/plantApi'

const PlantDetails = () => {
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchPlantDetails()
  }, [id])

  const fetchPlantDetails = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await plantApi.getPlantById(id)
      setPlant(response.data)
    } catch (err) {
      setError(err.message || 'Plant not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      alert('Please login to add items to cart')
      return
    }

    setAddingToCart(true)
    try {
      // Add to cart logic here
      console.log('Adding to cart:', { plantId: plant._id, quantity })
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Added to cart successfully!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: plant.name,
          text: `Check out this beautiful ${plant.name} on Urvann!`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        <p className="text-gray-600 text-lg">Loading plant details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Plant Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plants
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Plants
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
          {/* Plant Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {plant.imageUrl && !imageError ? (
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                  <span className="text-8xl animate-pulse">🌱</span>
                </div>
              )}
            </div>
          </div>

          {/* Plant Information */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{plant.name}</h1>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(plant.price)}
                </span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-current text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.5 stars)</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  plant.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {plant.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {plant.categories?.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            {plant.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{plant.description}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            {plant.inStock && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-900 mb-2">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 btn btn-primary text-lg py-3"
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </button>
                  
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Free Delivery</div>
                <div className="text-xs text-gray-500">On orders above ₹500</div>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Plant Health</div>
                <div className="text-xs text-gray-500">Guaranteed fresh</div>
              </div>
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Easy Returns</div>
                <div className="text-xs text-gray-500">7-day return policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="border-t border-gray-200 p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Plant Care Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">💧</div>
              <h3 className="font-semibold text-gray-900 mb-1">Watering</h3>
              <p className="text-sm text-gray-600">Water when soil feels dry to touch</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl mb-2">☀️</div>
              <h3 className="font-semibold text-gray-900 mb-1">Sunlight</h3>
              <p className="text-sm text-gray-600">Bright, indirect sunlight preferred</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">🌡️</div>
              <h3 className="font-semibold text-gray-900 mb-1">Temperature</h3>
              <p className="text-sm text-gray-600">18-24°C ideal temperature range</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-semibold text-gray-900 mb-1">Growth</h3>
              <p className="text-sm text-gray-600">Moderate growth rate expected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantDetails