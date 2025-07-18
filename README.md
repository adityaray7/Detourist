<p align="center">
  <img src="./frontend/public/logo.png" alt="Detourist Logo" width="400"/>
</p>

# Detourist: The Smart Travel Planner

Detourist is a web application designed to help users plan their road trips more effectively. It not only generates the optimal route between a start and end location but also discovers top-rated tourist attractions along the way, allowing users to create a customized and optimized multi-stop itinerary.

## Key Features

- **Dynamic Route Generation**: Get an initial travel route between any two locations using the Google Maps Directions API.
- **Attraction Discovery**: Specify the type of attractions you're interested in (e.g., 'tourist_attraction', 'museum', 'park'), and the app will find top-rated places along your route.
- **Optimized Itinerary**: Select your desired attractions from the discovered list, and Detourist will generate a new, optimized route that includes all your chosen stops in the most efficient order.
- **Interactive Map Visualization**: View the initial and optimized routes, along with markers for all attractions, on an interactive Google Map.

## Tech Stack

- **Frontend**: 
  - React
  - Tailwind CSS
  - Google Maps JavaScript API (for map rendering and visualization)
- **Backend**:
  - Node.js
  - Express.js
  - Google Maps Services for Node.js (for Directions and Places API calls)

## Setup and Installation

To run this project locally, you will need to set up both the backend and frontend services.

### Prerequisites

- Node.js and npm
- A valid Google Maps API key with the **Directions API** and **Places API** enabled.

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add your Google Maps API key:
    ```
    GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3001`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` directory and add your Google Maps API key, prefixed with `REACT_APP_`:
    ```
    REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
    ```
4.  Start the frontend development server:
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.
