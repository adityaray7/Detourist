import React from 'react';

const AttractionList = ({ attractions, selectedAttractions, onAddAttraction, onRemoveAttraction }) => {
  if (!attractions || attractions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-3">Recommended Attractions</h3>
      <ul className="space-y-3 h-64 overflow-y-auto pr-2">
        {attractions.map((attraction) => (
          <li key={attraction.place_id} className="p-3 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">{attraction.name}</p>
              <p className="text-sm text-yellow-500">Rating: {attraction.rating} ({attraction.user_ratings_total} reviews)</p>
            </div>
                        {
              selectedAttractions.find(a => a.place_id === attraction.place_id) ? (
                <button 
                  onClick={() => onRemoveAttraction(attraction)}
                  className="ml-4 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              ) : (
                <button 
                  onClick={() => onAddAttraction(attraction)}
                  className="ml-4 px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600"
                >
                  Add
                </button>
              )
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttractionList;
