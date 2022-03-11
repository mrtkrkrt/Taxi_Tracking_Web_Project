import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "1000px",
  height: "650px",
};

const center = {
  lat: 40.762296,
  lng: 29.928781,
};

const Dashboard = () => {
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
          zoom={11}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <></>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Dashboard;
