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

function getMarkers(coords, path) {
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
          icon={path}
        ></Marker>
      );
    }
  }
  return content;
}

const Dashboard = () => {
  const a = ["1"];
  const [coords_1, setCoords_1] = useState([]);
  const [coords_2, setCoords_2] = useState([]);
  const loggedUser = JSON.parse(localStorage.getItem("token"));
  const vehicleIdx = localStorage.getItem("idx");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    console.log(loggedUser);
    // get data and set
    const response = await fetch("http://localhost:3000/dashboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vehicleIdx: vehicleIdx,
      }),
    });

    const data = await response.json();
    setCoords_1(JSON.parse(data.coords_1));
    setCoords_2(JSON.parse(data.coords_2));
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
          <>
            {getMarkers(coords_1, "http://maps.google.com/mapfiles/ms/icons/red-dot.png")}
            {getMarkers(coords_2, "http://maps.google.com/mapfiles/ms/icons/blue-dot.png")}
          </>
        </GoogleMap>
      </LoadScript>
      <script src="http://maps.googleapis.com/maps/AIzaSyC_nS2IqNzSJVzHroRnFoOmRbqPRiM-k2Q/js?sensor=false"></script>
    </div>
  );
};

export default Dashboard;
