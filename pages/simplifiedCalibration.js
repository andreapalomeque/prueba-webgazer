let collectGazeData = false; // Control variable outside the component

import React, { useEffect, useState } from "react";
import Script from "next/script";
import localforage from "localforage";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const SimplifiedCalibration = () => {
  const router = useRouter();
  const [webGazerReady, setWebGazerReady] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [predictionPoints, setPredictionPoints] = useState([]);
  const [displayPoints, setDisplayPoints] = useState(false);

  useEffect(() => {
    const initializeWebGazer = () => {
      if (window.webgazer) {
        window.webgazer
          .setGazeListener((data, elapsedTime) => {
            if (data && collectGazeData) {
              setPredictionPoints((prevPoints) => [
                ...prevPoints,
                { ...data, elapsedTime },
              ]);
            }
          })
          .begin()
          .then(() => setWebGazerReady(true));
      }
    };

    document.addEventListener("webgazerLoaded", initializeWebGazer);
    return () => {
      document.removeEventListener("webgazerLoaded", initializeWebGazer);
      window.webgazer && window.webgazer.end();
    };
  }, []);

  const handleCentralPointClick = () => {
    if (clickCount === 0) {
      collectGazeData = true; // Enable data collection on first click
    }

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount >= 20) {
      setDisplayPoints(true);
      window.webgazer.end(); // Optionally stop WebGazer
      setGlobalData("webgazerGlobalData", predictionPoints).then(() =>
        console.log("Prediction points have been saved.")
      );
      downloadCSV(predictionPoints); // Download the data as CSV
    }
  };

  const setGlobalData = async (key, data) => {
    try {
      await localforage.setItem(key, data);
      console.log(`Data stored successfully under key ${key}`);
    } catch (error) {
      console.error(`Error storing data under key ${key}:`, error);
    }
  };

  // Function to download data as CSV
  const downloadCSV = (data) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // Include elapsedTime in the header
    csvContent += "X,Y,ElapsedTime\n";
    data.forEach(({ x, y, elapsedTime }) => {
      csvContent += `${x},${y},${elapsedTime}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "predictionPoints.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the file
  };

  // Function to show the alert
  const showCalibrationCompleteAlert = () => {
    Swal.fire({
      title: "Calibration Complete",
      text: "Do you want to redo the calibration or move to the next step?",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Next Step",
      cancelButtonText: "Redo Calibration",
    }).then((result) => {
      if (result.isConfirmed) {
        // move to eye-tracking page
        router.push("/calibration");
      } else {
        // Logic to redo calibration
        window.location.reload(); // Simple way to restart the calibration
      }
    });
  };

  return (
    <>
      <Script
        src="/webgazer.js"
        onLoad={() => document.dispatchEvent(new Event("webgazerLoaded"))}
        strategy="lazyOnload"
      />
      {webGazerReady && !displayPoints ? (
        <div
          onClick={handleCentralPointClick}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50px",
            height: "50px",
            backgroundColor: "red",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        ></div>
      ) : null}
      {displayPoints && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "auto",
          }}
        >
          {predictionPoints.map((point, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: `${point.y}px`,
                left: `${point.x}px`,
                width: "10px",
                height: "10px",
                backgroundColor: "blue",
                borderRadius: "50%",
              }}
            >
              <button
                onClick={showCalibrationCompleteAlert}
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "20px",
                  padding: "10px 20px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Next Step
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SimplifiedCalibration;
