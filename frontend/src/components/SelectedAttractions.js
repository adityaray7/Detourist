import React from 'react';

const SelectedAttractions = ({ selectedAttractions, onRemoveAttraction }) => {
  if (!selectedAttractions || selectedAttractions.length === 0) {
    return null;
  }

  const hasLegDetails = selectedAttractions.some(attraction => attraction.leg);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-light text-white mb-4">
        {hasLegDetails ? 'Your Optimized Itinerary' : 'Your Itinerary'}
      </h3>
      <ul className="space-y-3">
        {selectedAttractions.map((attraction, index) => (
          <React.Fragment key={attraction.place_id || index}>
            <li className={`p-4 rounded-lg border flex justify-between items-center transition-all ${attraction.isDestination ? 'bg-green-900/20 border-green-600' : 'bg-blue-900/20 border-blue-600'}`}>
              <div className="flex items-center">
                <span className={`text-white rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3 font-light ${attraction.isDestination ? 'bg-green-600' : 'bg-blue-600'}`}>
                  {index + 1}
                </span>
                <p className="font-light text-white">{attraction.name}</p>
              </div>
              {!attraction.isDestination && (
                <button
                  onClick={() => onRemoveAttraction(attraction)}
                  className="ml-4 px-4 py-2 bg-red-600 text-white text-sm font-light rounded-lg hover:bg-red-700 transition-all"
                >
                  Remove
                </button>
              )}
            </li>
            {attraction.leg && (
              <div className="pl-6 pr-2 py-2 flex items-center text-sm text-gray-400">
                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Travel: {attraction.leg.duration.text}</span>
                <span className="mx-2">·</span>
                <span>{attraction.leg.distance.text}</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default SelectedAttractions;
