import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  LoadScript,
  Marker,
  useGoogleMap,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "1000px",
  height: "650px",
};

const center = {
  lat: 62.992287,
  lng: 15.984631,
};

const position = {
  lat: 37.772,
  lng: -122.214,
};

function getMarkers(coords) {
  let content = [];
  if (coords.length > 30) {
    for (let i = 0; i < 30; i++) {
      content.push(
        <Marker
          key={coords[i]._id}
          position={{
            lat: parseFloat(coords[i].lat),
            lng: parseFloat(coords[i].lng),
          }}
        ></Marker>
      );
    }
  }
  return content;
}

const Dashboard = () => {
  const a = ["1"];
  const [coords, setCoords] = useState([]);
  const [temp, setTemp] = useState([]);
  const loggedUser = JSON.parse(localStorage.getItem("token"));

  useEffect(async () => {
    // get data and set
    const response = await fetch("http://localhost:3000/dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: loggedUser.id,
      }),
    });

    const data = await response.json();
    console.log(JSON.parse(data.coords)[0]);
    setCoords(JSON.parse(data.coords));
    setTemp(coords.splice(30));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoadScript googleMapsApiKey="AIzaSyC_nS2IqNzSJVzHroRnFoOmRbqPRiM-k2Q">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={5}
        >
          <>{getMarkers(coords)}</>
        </GoogleMap>
      </LoadScript>
      <script src="http://maps.googleapis.com/maps/AIzaSyC_nS2IqNzSJVzHroRnFoOmRbqPRiM-k2Q/js?sensor=false"></script>
    </div>
  );
};

export default Dashboard;
