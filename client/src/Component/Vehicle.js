import React, { useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "1000px",
  height: "650px",
};

const center = {
  lat: 62.992287,
  lng: 15.984631,
};

function getMarkers(coords, path) {
  let content = [];
  for (let i = 0; i < coords.length; i++) {
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

  return content;
}

function Vehicle() {
  const navigate = useNavigate();
  const selectedVehicleCoords = JSON.parse(
    localStorage.getItem("vehicleCoords")
  );
  const markerPath = JSON.parse(localStorage.getItem("markerPath"));
  const loggedUser = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {}, []);

  const logOut = async () => {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: loggedUser,
      }),
    });
    navigate("/");
  };

  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => {
          logOut();
        }}
      >
        ÇIKIŞ YAP
      </button>
      <LoadScript googleMapsApiKey="YOUR_MAP_API_KEY">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={5}
        >
          <>{getMarkers(selectedVehicleCoords, markerPath)}</>
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Vehicle;
