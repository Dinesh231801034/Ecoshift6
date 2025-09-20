import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ecoProducts, { categories, locations } from '../data/ecoProducts';

const Products = ({ globalSearchTerm, setGlobalSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Use global search term when coming from navbar
  useEffect(() => {
    if (globalSearchTerm) {
      setSearchTerm(globalSearchTerm);
      // Clear other filters when using global search
      setSelectedCategory('');
      setSelectedLocation('');
      // Clear global search term so it doesn't interfere with local search
      setGlobalSearchTerm('');
    }
  }, [globalSearchTerm, setGlobalSearchTerm]);

  // Filter products based on search criteria
  const filteredProducts = ecoProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.alternatives && product.alternatives.some(alt => alt.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesLocation = !selectedLocation || product.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-blue-50 w-full">
      <div className="w-full py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            🛍️ Eco-Friendly Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover sustainable alternatives to everyday products from trusted brands across India
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl shadow-sm border border-green-200 p-6 mb-8 mx-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Search Products
              </label>
              <input
                type="text"
                placeholder="Search by name, brand, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategory || selectedLocation || searchTerm) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="text-green-600 hover:text-green-800">×</button>
                </span>
              )}
              {selectedCategory && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')} className="text-blue-600 hover:text-blue-800">×</button>
                </span>
              )}
              {selectedLocation && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {selectedLocation}
                  <button onClick={() => setSelectedLocation('')} className="text-purple-600 hover:text-purple-800">×</button>
                </span>
              )}
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedLocation('');
                }}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {ecoProducts.length} products
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or clearing the filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
