const express = require('express');
const polyline = require('@mapbox/polyline');
const cors = require('cors');
require('dotenv').config();

const { Client } = require('@googlemaps/google-maps-services-js');
const app = express();
const mapsClient = new Client({});
const port = process.env.PORT || 3001;

const whitelist = ['http://localhost:3000', 'https://your-frontend-app.netlify.app']; // TODO: Replace with your frontend's deployed URL
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.send('Detourist backend is running!');
});

app.post('/api/generate-route', async (req, res) => {
  const { startLocation, endLocation, numAttractions, attractionType } = req.body;

  console.log('Received route generation request:', req.body);

  try {
    const response = await mapsClient.directions({
      params: {
        origin: startLocation,
        destination: endLocation,
        travelMode: 'DRIVING',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 10000, // 10 seconds
    });

    console.log('Successfully fetched initial directions.');

    // Step 1: Decode the route's polyline to get points along the path
    if (response.data.status !== 'OK') {
      console.error('Error fetching directions from Google Maps API:', response.data);
      return res.status(400).json({
        message: `Failed to generate route: ${response.data.error_message || response.data.status}`,
        error: response.data,
      });
    }

    const overview_polyline = response.data.routes[0].overview_polyline.points;
    const decodedPath = polyline.decode(overview_polyline);

    // Step 2: Select multiple points along the route to search for attractions
    // We'll pick up to 5 points, evenly spaced.
    const searchPoints = [];
    const numSearchPoints = Math.min(5, decodedPath.length);
    if (numSearchPoints > 0) {
        for (let i = 0; i < numSearchPoints; i++) {
            const point = decodedPath[Math.floor(i * decodedPath.length / numSearchPoints)];
            searchPoints.push({ lat: point[0], lng: point[1] });
        }
    }
    
    console.log(`Searching for attractions around ${searchPoints.length} points along the route.`);

    // Step 3: Perform a Places API search for each point
    const searchPromises = searchPoints.map(point => {
      return mapsClient.placesNearby({
        params: {
          location: point,
          radius: 10000, // Search within a 10km radius of each point
          type: attractionType,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
        timeout: 10000, // 10 seconds
      });
    });

    const searchResponses = await Promise.all(searchPromises);
    const allAttractions = searchResponses.flatMap(res => res.data.results);

    // Step 4: Deduplicate, sort, and select the top attractions
    const uniqueAttractions = Array.from(new Map(allAttractions.map(item => [item.place_id, item])).values());
    console.log(`Found ${uniqueAttractions.length} unique attractions.`);

    const sortedAttractions = uniqueAttractions
      .filter(p => p.rating) // Ensure place has a rating
      .sort((a, b) => b.rating - a.rating);

    const topAttractions = sortedAttractions.slice(0, numAttractions);
    console.log(`Returning the top ${topAttractions.length} attractions.`);

    res.json({
      message: 'Route and attractions found!',
      route: response.data,
      attractions: topAttractions,
    });
  } catch (error) {
    console.error('Error fetching directions from Google Maps API:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Failed to generate route.',
      error: error.response ? error.response.data.error_message : 'An unknown error occurred.',
    });
  }
});

app.post('/api/generate-optimized-route', async (req, res) => {
  const { startLocation, endLocation, waypoints } = req.body;

  console.log('Received optimized route generation request:', req.body);

  try {
    const response = await mapsClient.directions({
      params: {
        origin: startLocation,
        destination: endLocation,
        waypoints: waypoints
          .filter(waypoint => waypoint.place_id) // Ensure the waypoint has a place_id
          .map(waypoint => `place_id:${waypoint.place_id}`),
        optimize_waypoints: true,
        travelMode: 'DRIVING',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 10000, // 10 seconds
    });

    console.log('Successfully fetched optimized directions from Google Maps API.');
    res.json({
      message: 'Optimized route generated successfully!',
      route: response.data,
    });
  } catch (error) {
    console.error('Error fetching optimized directions:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Failed to generate optimized route.',
      error: error.response ? error.response.data.error_message : 'An unknown error occurred.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
