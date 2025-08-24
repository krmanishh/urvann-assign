import React, { useState, useEffect } from 'react'
import { Search, Filter, Loader2, AlertCircle } from 'lucide-react'
import PlantCard from '../components/PlantCard'
import { plantApi } from '../api/plantApi'

const CATEGORIES = [
  'Indoor',
  'Outdoor', 
  'Succulent',
  'Air Purifying',
  'Home Decor',
  'Flowering',
  'Medicinal'
]

const Home = () => {
  const [plants, setPlants] = useState([])
  const [filteredPlants, setFilteredPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPlants()
  }, [])

  useEffect(() => {
    filterPlants()
  }, [plants, searchTerm, selectedCategory])

  const fetchPlants = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await plantApi.getAllPlants()
      setPlants(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load plants')
    } finally {
      setLoading(false)
    }
  }

  const filterPlants = () => {
    let filtered = plants

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(term) ||
        plant.description?.toLowerCase().includes(term) ||
        plant.categories?.some(cat => cat.toLowerCase().includes(term))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(plant =>
        plant.categories?.includes(selectedCategory)
      )
    }

    setFilteredPlants(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        <p className="text-gray-600 text-lg">Loading plants...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-primary-600">Urvann</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover beautiful plants for your home and garden. From air-purifying indoor plants to stunning outdoor flowers.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search plants by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-col sm:flex-row gap-2 lg:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Clear Filters Button */}
            {(searchTerm || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedCategory) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory && (
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                Category: {selectedCategory}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <button
            onClick={fetchPlants}
            className="ml-auto text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results Count */}
      {!loading && plants.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredPlants.length} of {plants.length} plants
          </p>
        </div>
      )}

      {/* Plants Grid */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant) => (
            <PlantCard key={plant._id} plant={plant} />
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-8xl mb-6">🌱</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No plants found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || selectedCategory
              ? "Try adjusting your search criteria or browse all plants."
              : "No plants are available at the moment. Please check back later."}
          </p>
          {(searchTerm || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              View All Plants
            </button>
          )}
        </div>
      )}

      {/* Statistics Cards */}
      {plants.length > 0 && (
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {plants.length}
            </div>
            <div className="text-gray-600">Total Plants</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {plants.filter(p => p.inStock).length}
            </div>
            <div className="text-gray-600">In Stock</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {new Set(plants.flatMap(p => p.categories || [])).size}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              ₹{plants.length > 0 ? Math.min(...plants.map(p => p.price)) : 0}
            </div>
            <div className="text-gray-600">Starting From</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home