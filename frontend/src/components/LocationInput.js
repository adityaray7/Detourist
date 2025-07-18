import React, { useRef, useEffect } from 'react';

const LocationInput = ({ label, placeholder, value, onChange }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (window.google && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'], // Restrict to geographical locations
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          onChange(place.formatted_address);
        }
      });
    }
  }, [onChange]);

  return (
    <div>
      <label className="block text-sm font-light text-gray-300 mb-2">{label}</label>
      <input
        ref={inputRef}
        type="text"
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)} // Allow manual typing
      />
    </div>
  );
};

export default LocationInput;
