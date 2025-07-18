import React, { useRef, useEffect, useState } from 'react';

const Map = ({ route, attractions = [], selectedAttractions, onAttractionClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const directionsRendererRef = useRef(null); // Use a ref for the renderer

  // Hook 1: Initialize map and renderer ONCE
  useEffect(() => {
    if (window.google && mapRef.current && !map) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // Default to India
        zoom: 5,
        mapTypeControl: false,
      });
      setMap(googleMap);
      // Create the renderer and store it in the ref
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({ map: googleMap });
    }
  }, [map]); // Runs only when the map state changes (once)

  // Hook 2: Update route whenever the 'route' prop changes
  useEffect(() => {
    if (directionsRendererRef.current && route && route.routes && route.routes.length > 0) {
      // The route object from the backend is a plain JSON object. We must reconstruct it.
      const directionsResult = {
        ...route,
        request: {
          ...route.request,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
      };

      // Also, reconstruct the LatLngBounds object
      directionsResult.routes[0].bounds = new window.google.maps.LatLngBounds(
        route.routes[0].bounds.southwest,
        route.routes[0].bounds.northeast
      );

      directionsRendererRef.current.setDirections(directionsResult);
    }
  }, [route]); // Runs only when the route prop changes

  // Update attraction markers on the map
  useEffect(() => {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    if (map && attractions && attractions.length > 0) {
      const newMarkers = attractions.map(attraction => {
        const marker = new window.google.maps.Marker({
          position: attraction.geometry.location,
          map: map,
          title: attraction.name,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<h6>${attraction.name}</h6><p>Rating: ${attraction.rating}</p>`,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });
      setMarkers(newMarkers);
    } else {
      setMarkers([]);
    }

    // Cleanup function to clear markers when component unmounts
    return () => {
      markers.forEach(marker => marker.setMap(null));
    };
  }, [attractions, map]);
  

  return <div ref={mapRef} className="w-full h-full" />;
};

export default Map;
