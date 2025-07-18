import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import AttractionList from './components/AttractionList';
import LocationInput from './components/LocationInput';
import SelectedAttractions from './components/SelectedAttractions';
import API_URL from './api';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [numAttractions, setNumAttractions] = useState(5);
  const [route, setRoute] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [attractionType, setAttractionType] = useState('tourist_attraction');

  const handleGenerateRoute = async () => {
    if (!startLocation || !endLocation) {
      toast.error('Please enter both a start and end location.');
      return;
    }
    setLoading(true);
    setRoute(null);
    setAttractions([]);
    setSelectedAttractions([]);
    console.log('Sending route generation request to the backend...');

    try {
      const response = await fetch(`${API_URL}/api/generate-route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startLocation, endLocation, numAttractions, attractionType }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response from backend:', result);
      if (result.route) {
        setRoute(result.route);
      }
      if (result.attractions) {
        setAttractions(result.attractions);
      }
      toast.success(result.message);
    } catch (error) {
      console.error('Error sending request to backend:', error);
      toast.error('Failed to generate route. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttraction = (attraction) => {
    if (!selectedAttractions.find(a => a.place_id === attraction.place_id)) {
      setSelectedAttractions([...selectedAttractions, attraction]);
    }
  };

  const handleRemoveAttraction = (attraction) => {
    setSelectedAttractions(selectedAttractions.filter(a => a.place_id !== attraction.place_id));
  };

  const handleGenerateOptimizedRoute = async () => {
    if (selectedAttractions.length === 0) {
      toast.error('Please select at least one attraction to generate an optimized route.');
      return;
    }
    setLoading(true);

    console.log('Sending optimized route request to the backend...');
    try {
      const response = await fetch(`${API_URL}/api/generate-optimized-route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          startLocation, 
          endLocation, 
          waypoints: selectedAttractions
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Response from backend:', result);
      if (result.route && result.route.routes[0]) {
        const optimizedRoute = result.route.routes[0];
        setRoute(result.route);

        // Reorder the selected attractions based on the optimized waypoint order
        const waypointOrder = optimizedRoute.waypoint_order;
        const reorderedAttractions = waypointOrder.map(index => selectedAttractions[index]);
        
        // Add the destination as the final point in the itinerary
        const finalItinerary = [
          ...reorderedAttractions,
          { name: endLocation, isDestination: true }
        ];

        // Add leg information (duration, distance) to each item
        const itineraryWithDetails = finalItinerary.map((item, index) => {
          const leg = optimizedRoute.legs[index];
          return { ...item, leg };
        });

        setSelectedAttractions(itineraryWithDetails);
      }
      toast.success(result.message);
    } catch (error) {
      console.error('Error sending request to backend:', error);
      toast.error('Failed to generate optimized route. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <header className="bg-white shadow-md p-4">
        <h1 className="text-3xl font-bold text-gray-800">Detourist</h1>
        <p className="text-gray-600">Your smart travel planner</p>
      </header>

      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Plan Your Route</h2>
          <div className="space-y-4">
            <LocationInput 
              label="Start Location"
              placeholder="e.g., San Francisco, CA"
              value={startLocation}
              onChange={setStartLocation}
            />
            <LocationInput 
              label="End Location"
              placeholder="e.g., Los Angeles, CA"
              value={endLocation}
              onChange={setEndLocation}
            />
            <div>
              <label htmlFor="attraction-type" className="block text-sm font-medium text-gray-600 mb-1">Attraction Type</label>
              <select 
                id="attraction-type" 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={attractionType}
                onChange={(e) => setAttractionType(e.target.value)}
              >
                <option value="tourist_attraction">All Tourist Attractions</option>
                <option value="museum">Museums</option>
                <option value="park">Parks</option>
                <option value="restaurant">Restaurants</option>
                <option value="art_gallery">Art Galleries</option>
                <option value="amusement_park">Amusement Parks</option>
                <option value="zoo">Zoos</option>
              </select>
            </div>
            <div>
              <label htmlFor="num-attractions" className="block text-sm font-medium text-gray-600 mb-1">Number of Attractions</label>
              <input type="number" id="num-attractions" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 5" min="1" value={numAttractions} onChange={(e) => setNumAttractions(e.target.value)} />
            </div>
            <button onClick={handleGenerateRoute} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed">
              {loading ? 'Generating...' : 'Generate Initial Route'}
            </button>
          </div>
          <AttractionList 
            attractions={attractions} 
            selectedAttractions={selectedAttractions}
            onAddAttraction={handleAddAttraction}
            onRemoveAttraction={handleRemoveAttraction}
          />

          <SelectedAttractions 
            selectedAttractions={selectedAttractions}
            onRemoveAttraction={handleRemoveAttraction}
          />

          {selectedAttractions.length > 0 && (
            <div className="mt-6">
              <button onClick={handleGenerateOptimizedRoute} disabled={loading} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out disabled:bg-purple-400 disabled:cursor-not-allowed">
                {loading ? 'Optimizing...' : `Generate Route with ${selectedAttractions.length} Attraction(s)`}
              </button>
            </div>
          )}
        </div>
        <div className="md:col-span-2 rounded-lg shadow-lg overflow-hidden">
          <Map route={route} attractions={attractions} />
        </div>
      </main>
    </div>
  );
}

export default App;
