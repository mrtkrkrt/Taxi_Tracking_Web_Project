import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StreetViewPanorama,
} from "@react-google-maps/api";

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
  if (coords.length > 30) {
    for (let i = coords.length - 1; i > coords.length - 30; i--) {
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
  const navigate = useNavigate();
  const [coords_1, setCoords_1] = useState([]);
  const [coords_2, setCoords_2] = useState([]);
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [firstStartHour, setFirstStartHour] = useState("");
  const [firstEndHour, setFirstEndHour] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [secondStartHour, setSecondStartHour] = useState("");
  const [secondEndHour, setSecondEndHour] = useState("");
  const loggedUser = JSON.parse(localStorage.getItem("token"));
  const vehicleIdx = localStorage.getItem("idx");
  let selectedVehicleCoords = [];

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

  const checkDateExist = (date, vehicleCoords) => {
    for (let i = 0; i < vehicleCoords.length; i++) {
      if (
        new String(vehicleCoords[i].date).valueOf === new String(date).valueOf
      )
        return true;
    }
    return false;
  };

  const checkDateRange = () => {
    const date1 = new Date(startDay + "/" + startMonth + "/" + startYear);
    const date2 = new Date(endDay + "/" + endMonth + "/" + endYear);

    let difference = date2.getTime() - date1.getTime();
    return difference > 0;
  };

  const checkHourRange = () => {
    if (firstStartHour > secondStartHour) {
      return false;
    } else {
      if (firstEndHour > secondEndHour) {
        return false;
      }
    }
    return true;
  };

  const getRangeCoords = (startDate, endDate, vehicleCoords) => {
    let isFind = false,
      filteredCoordinates = [];

    for (let i = 0; i < vehicleCoords.length; i++) {
      if (vehicleCoords[i].date == startDate) {
        isFind = true;
        filteredCoordinates.push(vehicleCoords[i]);
      }
      if (vehicleCoords[i].date == endDate) {
        filteredCoordinates.push(vehicleCoords[i]);
        break;
      }
      if (isFind) {
        filteredCoordinates.push(vehicleCoords[i]);
      }
    }
    return filteredCoordinates;
  };

  const navigatePage = (vehicleCoords, markerPath, vehicleId) => {
    if (
      startDay === "" ||
      startYear === "" ||
      startMonth === "" ||
      firstStartHour === "" ||
      firstEndHour === "" ||
      endDay === "" ||
      endMonth === "" ||
      endYear === "" ||
      secondStartHour === "" ||
      secondStartHour === ""
    ) {
      alert("Tarih alanlarından biri boş bırakılamaz.");
      return;
    }
    const startDate =
      startDay +
      "/" +
      startMonth +
      "/" +
      startYear +
      " " +
      firstStartHour +
      ":" +
      firstEndHour;

    const endDate =
      endDay +
      "/" +
      endMonth +
      "/" +
      endYear +
      " " +
      secondStartHour +
      ":" +
      secondEndHour;
    console.log(startDate, endDate);
    if (
      !checkDateExist(startDate, vehicleCoords) ||
      !checkDateExist(endDate, vehicleCoords)
    ) {
      alert("LÜtfen geçerli bir tarih giriniz!");
      return;
    }

    let promise = new Promise((resolve, reject) => {
      selectedVehicleCoords = getRangeCoords(startDate, endDate, vehicleCoords);
      resolve();
    }).then(() => {
      console.log("Selected => ", selectedVehicleCoords);
      localStorage.setItem(
        "vehicleCoords",
        JSON.stringify(selectedVehicleCoords)
      );
      localStorage.setItem("markerPath", JSON.stringify(markerPath));
      navigate("/vehicle");
    });
  };

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
      <LoadScript googleMapsApiKey="AIzaSyC_nS2IqNzSJVzHroRnFoOmRbqPRiM-k2Q">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={5}
        >
          <>
            {getMarkers(
              coords_1,
              "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            )}
            {getMarkers(
              coords_2,
              "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            )}
          </>
        </GoogleMap>
      </LoadScript>
      <div
        style={{
          display: "grid",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() =>
            navigatePage(
              coords_1,
              "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              vehicleIdx
            )
          }
        >
          Mavi Araç
        </button>
        <button
          onClick={() =>
            navigatePage(
              coords_2,
              "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              vehicleIdx
            )
          }
        >
          Kırmızı Araç
        </button>
      </div>
      <div
        style={{
          display: "grid",
          justifyContent: "center",
        }}
      >
        <form>
          <p>Başlangıç Tarihi</p>
          <input
            placeholder="Ay"
            onChange={(e) => {
              setStartDay(e.target.value);
            }}
          ></input>
          <input
            placeholder="Gün"
            onChange={(e) => {
              setStartMonth(e.target.value);
            }}
          ></input>
          <input
            placeholder="Yıl"
            onChange={(e) => {
              setStartYear(e.target.value);
            }}
          ></input>
          <input
            placeholder="Başlangıç Saati"
            onChange={(e) => {
              setFirstStartHour(e.target.value);
            }}
          ></input>
          <input
            placeholder="Bitiş Saati"
            onChange={(e) => {
              setFirstEndHour(e.target.value);
            }}
          ></input>
        </form>
        <form>
          <p>Bitiş Tarihi</p>
          <input
            placeholder="Ay"
            onChange={(e) => {
              setEndDay(e.target.value);
            }}
          ></input>
          <input
            placeholder="Gün"
            onChange={(e) => {
              setEndMonth(e.target.value);
            }}
          ></input>
          <input
            placeholder="Yıl"
            onChange={(e) => {
              setEndYear(e.target.value);
            }}
          ></input>
          <input
            placeholder="Başlangıç Saati"
            onChange={(e) => {
              setSecondStartHour(e.target.value);
            }}
          ></input>
          <input
            placeholder="Bitiş Saati"
            onChange={(e) => {
              setSecondEndHour(e.target.value);
            }}
          ></input>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
