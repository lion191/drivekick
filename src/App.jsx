import { useEffect, useState } from "react";
import Map from "./Map";
import "./App.css";
import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function App() {
  const [destination, setDestination] = useState("");
  const [inputValue, setInputValue] = useState("");
  const autocompleteRef = useRef(null);
  const [userLocation,setUserLocation] = useState(null);
  const [parkingSpots, setParkingSpots] = useState([]);

  const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: apiKey,
  libraries: libraries,
  });

  useEffect(
    () =>{
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },

        (error) => console.log("Error getting user location:", error)

      );


    },[]
  );

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="app">
      <header className="app-header">
      <h1>DriveKick 🚗⚽</h1>
      <p className="tagline">Beat traffic. Find parking. Never miss kickoff.</p>
      </header>
      <section className="search-section">

      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged = {
          () =>{
            const place = autocompleteRef.current.getPlace();
            if(place && place.geometry){
              const name = place.name;
              const location = place.geometry.location;

              setDestination({
                lat: location.lat(),
                lng: location.lng(),
              });
              setInputValue(name);
            }
          }
        }
      >
        <input
          placeholder="Enter stadium (e.g. Mercedes-Benz Stadium)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Autocomplete>

      <button onClick={() => setDestination(inputValue)} disabled={!inputValue}>Find Route</button>

      </section>

      <section className="info-section">
      <p className="features">
        🚗 Fastest route • 🅿️ Nearby parking • ⏰ Arrive on time
      </p>
      <h2>Your Route</h2>
      </section>

      
        {destination && (
          <section className="map-section">
          <Map destination={destination} 
          origin={userLocation} 
          setParkingSpots={setParkingSpots} />
          </section>
        )}

        {!destination && (
          <p className="placeholder">Enter a stadium to plan your trip</p>
        )}
      
      
      {parkingSpots.length > 0 && (
      <section className="parking-section">
      <div>
        <h2>Parking Options</h2>
          <div className="parking-list">
            {
              parkingSpots.map( (spot,index) =>(
                <div key={index} className="parking-card">
                  <h3>{spot.name}</h3>
                  <p>{spot.vicinity}</p>
                </div>
              )
              )
            }
        </div>

      </div>
      </section>
      )}


    </div>
    
  );
}

export default App;
