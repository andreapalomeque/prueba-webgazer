// Calibration.js
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import localforage from "localforage";

const Calibration = () => {
  const router = useRouter();
  const [webGazerReady, setWebGazerReady] = useState(false);

  useEffect(() => {
    // check that data is being saved, catch the error if it is not
    localforage
      .getItem("webgazerGlobalData")
      .then(function (value) {
        console.log("data saving", value);
      })
      .catch(function (err) {
        console.error("Error retrieving webgazerGlobalData:", err);
      });
    // Function to check if WebGazer is ready
    const checkWebGazerReady = () => {
      if (window.webgazer) {
        window.webgazer
          .saveDataAcrossSessions(true) //! check if this is necessary
          .setGazeListener((data, elapsedTime) => {
            if (!data) return;
            console.log(data, elapsedTime);
          })
          .begin();
        setWebGazerReady(true);
        // Resize or reposition the camera feed
        const videoFeed = document.getElementById("webgazerVideoFeed");
        if (videoFeed) {
          videoFeed.style.right = "0px";
          videoFeed.style.top = "0px";
          videoFeed.width = 160; // Adjust as necessary
          videoFeed.height = 120; // Adjust as necessary
        }

        const videoCanvas = document.getElementById("webgazerVideoCanvas");
        if (videoCanvas) {
          videoCanvas.style.right = "0px";
          videoCanvas.style.top = "0px";
          videoCanvas.width = 160; // Adjust as necessary
          videoCanvas.height = 120; // Adjust as necessary
        }
      } else {
        setTimeout(checkWebGazerReady, 100);
      }
    };

    checkWebGazerReady();
  }, []); //empty array to run only once

  // Define points with initial color (red) and positions
  const initialPoints = [
    { x: 10, y: 10, color: "red" },
    { x: 50, y: 10, color: "red" },
    { x: 90, y: 10, color: "red" },
    { x: 10, y: 50, color: "red" },
    { x: 50, y: 50, color: "red" },
    { x: 90, y: 50, color: "red" },
    { x: 10, y: 90, color: "red" },
    { x: 50, y: 90, color: "red" },
    { x: 90, y: 90, color: "red" },
  ];

  const [points, setPoints] = useState(initialPoints);

  const handleCalibrationClick = (index) => {
    // Update the click count and color of the clicked point
    const newPoints = points.map((point, idx) => {
      if (idx === index) {
        let nextColor = point.color;
        let nextClickCount = (point.clickCount || 0) + 1; // Increment click count, initialize if not present

        // Change color after every 10 clicks
        if (nextClickCount % 10 === 0) {
          if (nextColor === "red") nextColor = "yellow";
          else if (nextColor === "yellow") nextColor = "green";
          else nextColor = point.color; // Keep the current color
        }

        return { ...point, color: nextColor, clickCount: nextClickCount };
      }
      return point;
    });
    setPoints(newPoints);

    // Check if all points are green (or whatever logic you have for calibration completion)
    if (newPoints.every((point) => point.color === "green")) {
      onCalibrationComplete();
    }
  };

  const onCalibrationComplete = () => {
    router.push("/simplifiedCalibration");
  };

  return (
    <>
      <Script
        src="/webgazer.js"
        onLoad={() => {
          window.dispatchEvent(new Event("webgazerLoaded"));
        }}
        strategy="lazyOnload"
      />
      {webGazerReady ? (
        <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
          {points.map((point, index) => (
            <div
              key={index}
              onClick={() => handleCalibrationClick(index)}
              style={{
                position: "absolute",
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: "40px",
                height: "40px",
                backgroundColor: point.color,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer",
                userSelect: "none",
                zIndex: 1000, // Ensure
              }}
            ></div>
          ))}
        </div>
      ) : (
        <div>Loading Eye Tracker...</div>
      )}
    </>
  );
};

export default Calibration;
