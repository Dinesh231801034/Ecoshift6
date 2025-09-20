import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Map, 
  List, 
  Search, 
  Filter, 
  Navigation, 
  Phone, 
  Clock, 
  Star, 
  ExternalLink,
  X,
  ShoppingBag,
  MapPin,
  RefreshCw
} from 'lucide-react';
import StoreCard from '../components/StoreCard';
import StoreProductCard from '../components/StoreProductCard';
import mockStores, { calculateDistance, sortStoresByDistance, isStoreOpen } from '../data/mockStores';
import 'leaflet/dist/leaflet.css';
import './Stores.css';

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icons
const createCustomIcon = (isOpen, isUser = false) => {
  const color = isUser ? '#3B82F6' : isOpen ? '#10B981' : '#EF4444';
  const iconHtml = isUser 
    ? '<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>'
    : `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm" style="background-color: ${color}">
         ${isOpen ? '✓' : '✕'}
       </div>`;
  
  return L.divIcon({
    className: 'custom-marker',
    html: iconHtml,
    iconSize: [isUser ? 24 : 32, isUser ? 24 : 32],
    iconAnchor: [isUser ? 12 : 16, isUser ? 12 : 16],
  });
};

// Component to update map center when user location changes
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const Stores = () => {
  const [stores, setStores] = useState(mockStores);
  const [userLocation, setUserLocation] = useState([12.9716, 77.5946]); // Default to Bangalore
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minRating: 0,
    maxDistance: 50,
    showOpenOnly: false,
  });
  const [selectedStore, setSelectedStore] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
  const [mapZoom, setMapZoom] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const mapRef = useRef(null);

  // Get user's current location function
  const getUserLocation = (showLoading = false) => {
    if (showLoading) {
      setIsGettingLocation(true);
      setLocationError(null);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setMapZoom(12);
          
          // Update store distances
          const updatedStores = sortStoresByDistance(mockStores, latitude, longitude);
          setStores(updatedStores);
          setIsLoading(false);
          setIsGettingLocation(false);
          setLocationError(null);
          setLocationSuccess(true);
          
          // Hide success message after 3 seconds
          setTimeout(() => setLocationSuccess(false), 3000);
        },
        (error) => {
          console.warn('Geolocation error:', error);
          let errorMessage = 'Unable to get your location';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please allow location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          setLocationError(errorMessage);
          setIsGettingLocation(false);
          
          // Use default location (Bangalore) if this is initial load
          if (!showLoading) {
            const updatedStores = sortStoresByDistance(mockStores, 12.9716, 77.5946);
            setStores(updatedStores);
            setIsLoading(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
      
      // Fallback to default location
      const updatedStores = sortStoresByDistance(mockStores, 12.9716, 77.5946);
      setStores(updatedStores);
      setIsLoading(false);
    }
  };

  // Get user's current location on initial load
  useEffect(() => {
    getUserLocation();
  }, []);

  // Filter stores based on search and filters
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = store.rating >= filters.minRating;
    const matchesDistance = store.distance <= filters.maxDistance;
    const matchesOpenStatus = !filters.showOpenOnly || store.isOpen;
    
    return matchesSearch && matchesRating && matchesDistance && matchesOpenStatus;
  });

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    setMapCenter([store.latitude, store.longitude]);
    setMapZoom(15);
  };

  const handleViewProducts = (store) => {
    setSelectedStore(store);
    setShowProductModal(true);
  };

  const handleLocateOnMap = (store) => {
    setViewMode('map');
    handleStoreClick(store);
  };

  const handleAddToCart = async (product) => {
    // TODO: Integrate with your cart system
    console.log('Adding to cart:', product);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleAddToWishlist = async (product) => {
    // TODO: Integrate with your wishlist system
    console.log('Adding to wishlist:', product);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const resetFilters = () => {
    setFilters({
      minRating: 0,
      maxDistance: 50,
      showOpenOnly: false,
    });
    setSearchTerm('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Find EcoSwitch Stores</h1>
              <p className="text-gray-600 mt-1">Discover sustainable products at stores near you</p>
            </div>
            
            {/* View Toggle and Location Button */}
            <div className="flex items-center space-x-2">
              {/* Live Location Button */}
              <button
                onClick={() => getUserLocation(true)}
                disabled={isGettingLocation}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isGettingLocation
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title="Get your current location"
              >
                {isGettingLocation ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span>{isGettingLocation ? 'Getting Location...' : 'Live Location'}</span>
              </button>

              {/* View Toggle */}
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Map View</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <List className="w-4 h-4" />
                <span>List View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Status */}
      {locationError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{locationError}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setLocationError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Success */}
      {locationSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  ✅ Location updated successfully! Showing stores near you.
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setLocationSuccess(false)}
                  className="text-green-400 hover:text-green-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search stores by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {/* Location Status */}
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>
                  {userLocation[0] !== 12.9716 || userLocation[1] !== 77.5946 
                    ? `Your location: ${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}`
                    : 'Using default location (Bangalore)'
                  }
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center space-x-4">
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>

              <select
                value={filters.maxDistance}
                onChange={(e) => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={5}>Within 5km</option>
                <option value={10}>Within 10km</option>
                <option value={25}>Within 25km</option>
                <option value={50}>Within 50km</option>
                <option value={100}>Within 100km</option>
              </select>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.showOpenOnly}
                  onChange={(e) => setFilters({...filters, showOpenOnly: e.target.checked})}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Open now</span>
              </label>

              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <MapUpdater center={mapCenter} zoom={mapZoom} />
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* User Location Marker */}
                  <Marker position={userLocation} icon={createCustomIcon(true, true)}>
                    <Popup>
                      <div className="text-center p-2">
                        <div className="flex items-center justify-center mb-2">
                          <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                          <p className="font-semibold text-blue-600">Your Location</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          📍 Current position
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>Lat: {userLocation[0].toFixed(6)}</p>
                          <p>Lng: {userLocation[1].toFixed(6)}</p>
                        </div>
                        <button
                          onClick={() => getUserLocation(true)}
                          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
                        >
                          Update Location
                        </button>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Store Markers */}
                  {filteredStores.map(store => (
                    <Marker
                      key={store.id}
                      position={[store.latitude, store.longitude]}
                      icon={createCustomIcon(store.isOpen)}
                      eventHandlers={{
                        click: () => handleStoreClick(store),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-gray-800 mb-2">{store.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{store.address}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{store.rating}</span>
                            <span className="text-xs text-gray-500">({store.reviewCount} reviews)</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              store.isOpen 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {store.isOpen ? 'Open' : 'Closed'}
                            </span>
                            <span className="text-xs text-gray-500">{store.distance}km away</span>
                          </div>
                          <button
                            onClick={() => handleViewProducts(store)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1 px-3 rounded transition-colors"
                          >
                            View Products
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Store List Sidebar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Nearby Stores ({filteredStores.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredStores.map(store => (
                  <div
                    key={store.id}
                    className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleStoreClick(store)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm">{store.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        store.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {store.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{store.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{store.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{store.distance}km</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {filteredStores.length} Stores Found
              </h2>
              <p className="text-gray-600">
                {searchTerm && `Search results for "${searchTerm}"`}
                {filters.showOpenOnly && ' • Showing only open stores'}
                {filters.minRating > 0 && ` • Rating ${filters.minRating}+ stars`}
                {filters.maxDistance < 50 && ` • Within ${filters.maxDistance}km`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map(store => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onViewProducts={handleViewProducts}
                  onLocateOnMap={handleLocateOnMap}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedStore.name}</h2>
                <p className="text-gray-600">{selectedStore.address}</p>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedStore.products.map(product => (
                  <StoreProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
