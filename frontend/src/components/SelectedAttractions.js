import React from 'react';

const SelectedAttractions = ({ selectedAttractions, onRemoveAttraction }) => {
  if (!selectedAttractions || selectedAttractions.length === 0) {
    return null;
  }

  const hasLegDetails = selectedAttractions.some(attraction => attraction.leg);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-3">
        {hasLegDetails ? 'Your Optimized Itinerary' : 'Your Itinerary'}
      </h3>
      <ul className="space-y-2">
        {selectedAttractions.map((attraction, index) => (
          <React.Fragment key={attraction.place_id || index}>
            <li className={`p-3 rounded-lg shadow-sm flex justify-between items-center ${attraction.isDestination ? 'bg-green-100' : 'bg-blue-100'}`}>
              <div className="flex items-center">
                <span className={`text-white rounded-full h-6 w-6 text-sm flex items-center justify-center mr-3 ${attraction.isDestination ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {index + 1}
                </span>
                <p className="font-semibold text-gray-800">{attraction.name}</p>
              </div>
              {!attraction.isDestination && (
                <button
                  onClick={() => onRemoveAttraction(attraction)}
                  className="ml-4 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </li>
            {attraction.leg && (
              <div className="pl-5 pr-2 py-2 flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
