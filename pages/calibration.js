// Calibration.js
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";

const Calibration = () => {
  const router = useRouter();
  const [webGazerReady, setWebGazerReady] = useState(false);

  useEffect(() => {
    // Function to check if WebGazer is ready
    const checkWebGazerReady = () => {
      if (window.webgazer) {
        window.webgazer
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
  }, []);

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
    // Update the color of the clicked point
    const newPoints = points.map((point, idx) => {
      if (idx === index) {
        const nextColor = point.color === "red" ? "yellow" : "green";
        return { ...point, color: nextColor };
      }
      return point;
    });
    setPoints(newPoints);

    // Check if all points are green
    if (newPoints.every((point) => point.color === "green")) {
      onCalibrationComplete();
    }
  };

  const onCalibrationComplete = () => {
    //alert("Calibration complete!");
    router.push("/eye-tracking");
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
