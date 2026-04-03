import {
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};



export default function Map({destination, origin, setParkingSpots}) {
  const [directions, setDirections] = useState(null);


  useEffect(() => {
    if (!destination || !origin || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: new window.google.maps.LatLng(
          origin.lat,
          origin.lng
        ),
        destination: new window.google.maps.LatLng(
            destination.lat,
            destination.lng
            ),
        travelMode: "DRIVING",
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        }else {
        console.log("Directions request failed:", status);
        }
      }
    );

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(
        {
        location: new window.google.maps.LatLng(destination.lat, destination.lng),
        radius: 1500,
        type: 'parking',
       },(results,status) =>{
          if(status === window.google.maps.places.PlacesServiceStatus.OK){
            setParkingSpots(results);
          }
       }
    );
  }, [destination,origin,setParkingSpots]);

  return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 34.73, lng: -86.58 }}
        zoom={10}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

  );
}