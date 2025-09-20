import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  searchable = false,
  multiple = false,
  label = "",
  error = "",
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (option) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.some(v => v.value === option.value);
      
      if (isSelected) {
        onChange(currentValues.filter(v => v.value !== option.value));
      } else {
        onChange([...currentValues, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
      setSearchTerm("");
    }
    setHighlightedIndex(-1);
  };

  const getDisplayValue = () => {
    if (multiple) {
      const selectedOptions = Array.isArray(value) ? value : [];
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} selected`;
    }
    return value ? value.label : placeholder;
  };

  const isSelected = (option) => {
    if (multiple) {
      return Array.isArray(value) && value.some(v => v.value === option.value);
    }
    return value && value.value === option.value;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Dropdown Button */}
      <div
        ref={dropdownRef}
        className="relative"
      >
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-left bg-white border rounded-lg shadow-sm
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            ${disabled 
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' 
              : isOpen
                ? 'border-green-500 ring-2 ring-green-500 ring-opacity-20'
                : 'border-gray-300 hover:border-gray-400 focus:border-green-500'
            }
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={label || placeholder}
        >
          <div className="flex items-center justify-between">
            <span className={`block truncate ${!value && !multiple ? 'text-gray-500' : 'text-gray-900'}`}>
              {getDisplayValue()}
            </span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {searchTerm ? 'No options found' : 'No options available'}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors duration-150
                      flex items-center justify-between
                      ${index === highlightedIndex 
                        ? 'bg-green-50 text-green-700' 
                        : 'hover:bg-gray-50'
                      }
                      ${isSelected(option) ? 'bg-green-50 text-green-700' : 'text-gray-900'}
                    `}
                    role="option"
                    aria-selected={isSelected(option)}
                  >
                    <span className="block truncate">{option.label}</span>
                    {isSelected(option) && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Multiple Selection Footer */}
            {multiple && filteredOptions.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CustomDropdown;
