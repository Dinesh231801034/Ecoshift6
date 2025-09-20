import React from 'react';
import { MapPin, Phone, Clock, Star, ExternalLink, ShoppingBag } from 'lucide-react';

const StoreCard = ({ store, onViewProducts, onLocateOnMap }) => {
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance}km`;
  };

  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const getCurrentHours = () => {
    const currentDay = getCurrentDay();
    return store.openingHours[currentDay] || 'Closed';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Store Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop';
          }}
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            store.isOpen 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {store.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        {/* Distance Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold border border-blue-200">
            {formatDistance(store.distance)}
          </span>
        </div>
      </div>

      {/* Store Info */}
      <div className="p-6">
        {/* Store Name and Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 leading-tight">{store.name}</h3>
          <div className="flex items-center space-x-1 ml-4">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-700">{store.rating}</span>
            <span className="text-xs text-gray-500">({store.reviewCount})</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 text-sm leading-relaxed">{store.address}</p>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-2 mb-3">
          <Phone className="w-4 h-4 text-gray-500" />
          <a 
            href={`tel:${store.phone}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            {store.phone}
          </a>
        </div>

        {/* Opening Hours */}
        <div className="flex items-start space-x-2 mb-4">
          <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Today:</span> {getCurrentHours()}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {store.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium"
              >
                {feature}
              </span>
            ))}
            {store.features.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                +{store.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onViewProducts(store)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View Products</span>
          </button>
          <button
            onClick={() => onLocateOnMap(store)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Locate</span>
          </button>
        </div>

        {/* Website Link */}
        {store.website && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <a
              href={store.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Visit Website</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCard;
