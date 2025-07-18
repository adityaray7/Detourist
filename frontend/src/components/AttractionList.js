import React from 'react';

const AttractionList = ({ attractions, selectedAttractions, onAddAttraction, onRemoveAttraction }) => {
  if (!attractions || attractions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-light text-white mb-4">Recommended Attractions</h3>
      <ul className="space-y-3 h-64 overflow-y-auto pr-2">
        {attractions.map((attraction) => (
          <li key={attraction.place_id} className="p-4 bg-gray-700 rounded-lg border border-gray-600 flex justify-between items-center hover:bg-gray-650 transition-all">
            <div>
              <p className="font-light text-white">{attraction.name}</p>
              <p className="text-sm text-yellow-400">★ {attraction.rating} ({attraction.user_ratings_total} reviews)</p>
            </div>
                        {
              selectedAttractions.find(a => a.place_id === attraction.place_id) ? (
                <button 
                  onClick={() => onRemoveAttraction(attraction)}
                  className="ml-4 px-4 py-2 bg-red-600 text-white text-sm font-light rounded-lg hover:bg-red-700 transition-all"
                >
                  Remove
                </button>
              ) : (
                <button 
                  onClick={() => onAddAttraction(attraction)}
                  className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-light rounded-lg hover:bg-green-700 transition-all"
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
