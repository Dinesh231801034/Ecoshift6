import { useState, useEffect } from 'react';
import ecoProducts, { categories, subcategories, locations } from '../data/ecoProducts';
import ProductCard from '../components/ProductCard';

const Services = ({ globalSearchTerm, setGlobalSearchTerm }) => {
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    product: '',
    location: '',
    email: '',
    name: ''
  });

  // Use global search term when coming from navbar
  useEffect(() => {
    if (globalSearchTerm) {
      setFormData(prev => ({
        ...prev,
        product: globalSearchTerm
      }));
      // Clear global search term so it doesn't interfere
      if (setGlobalSearchTerm) setGlobalSearchTerm('');
    }
  }, [globalSearchTerm, setGlobalSearchTerm]);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'category' && { subcategory: '' })
    }));
  };

  const getRecommendations = () => {
    let filtered = ecoProducts;

    // Filter by category
    if (formData.category) {
      filtered = filtered.filter(product => product.category === formData.category);
    }

    // Filter by subcategory
    if (formData.subcategory) {
      filtered = filtered.filter(product => product.subcategory === formData.subcategory);
    }

    // Filter by location (prioritize same location, but include others)
    if (formData.location) {
      const sameLocation = filtered.filter(product => product.location === formData.location);
      const otherLocations = filtered.filter(product => product.location !== formData.location);
      filtered = [...sameLocation, ...otherLocations];
    }

    // Search for product alternatives if specific product mentioned
    if (formData.product) {
      const productKeywords = formData.product.toLowerCase().split(' ');
      filtered = filtered.filter(product => {
        const productText = `${product.name} ${product.description} ${product.alternatives?.join(' ') || ''}`.toLowerCase();
        return productKeywords.some(keyword => productText.includes(keyword)) ||
               product.alternatives?.some(alt => alt.toLowerCase().includes(formData.product.toLowerCase()));
      });
    }

    // Sort by rating and limit to top 6
    return filtered.sort((a, b) => b.rating - a.rating).slice(0, 6);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recs = getRecommendations();
    setRecommendations(recs);
    setShowRecommendations(true);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      subcategory: '',
      product: '',
      location: '',
      email: '',
      name: ''
    });
    setRecommendations([]);
    setShowRecommendations(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-blue-50 w-full">
      <div className="w-full py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            🔧 Personalized Eco Services
          </h1>
          <p className="text-gray-600 max-w-4xl mx-auto">
            Tell us about the products you're looking for and we'll recommend the best eco-friendly alternatives available in your area
          </p>
        </div>

        {!showRecommendations ? (
          /* Recommendation Form */
          <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl shadow-lg border border-green-200 p-8 w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📂 Product Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {formData.category && subcategories[formData.category] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏷️ Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a subcategory (optional)</option>
                    {subcategories[formData.category].map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Specific Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🛍️ Specific Product (Optional)
                </label>
                <input
                  type="text"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 'plastic toothbrush', 'Tide detergent', 'H&M t-shirt'"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Tell us about the current product you use, and we'll find eco-friendly alternatives
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Your Location *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select your city</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  We'll prioritize products available in your area
                </p>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Finding Recommendations...</span>
                    </>
                  ) : (
                    <>
                      <span>🌿</span>
                      <span>Get My Eco Recommendations</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Recommendations Results */
          <div className="space-y-8 w-full">
            {/* Results Header */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 w-full max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  🎉 Your Personalized Recommendations
                </h2>
                <p className="text-green-700 mb-4">
                  Hi {formData.name}! Based on your preferences, we found {recommendations.length} eco-friendly alternatives
                  {formData.location && ` prioritized for ${formData.location}`}
                </p>
                <button
                  onClick={resetForm}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  🔄 Get New Recommendations
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            {recommendations.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
                {recommendations.map((product, index) => (
                  <div key={index} className="relative">
                    <ProductCard product={product} />
                    {product.location === formData.location && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        📍 Local
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 w-full max-w-2xl mx-auto">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No specific matches found</h3>
                <p className="text-gray-500 mb-4">
                  We couldn't find products matching your exact criteria, but check out our full product catalog
                </p>
                <button
                  onClick={resetForm}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Try Different Criteria
                </button>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 w-full max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">📧 Need More Help?</h3>
              <p className="text-blue-700 mb-4">
                Our eco-experts are here to help you find the perfect sustainable alternatives. 
                We'll send detailed recommendations to {formData.email}
              </p>
              <div className="space-y-2 text-sm text-blue-600">
                <p>📞 Call us: +91-789456123</p>
                <p>📧 Email: recommendations@ecoswitch.com</p>
                <p>💬 WhatsApp: +91-98765-43210</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
