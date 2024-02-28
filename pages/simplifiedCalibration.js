import React, { useEffect, useState } from "react";
import Script from "next/script";
import localforage from "localforage";

const SimplifiedCalibration = () => {
  const [webGazerReady, setWebGazerReady] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [predictionPoints, setPredictionPoints] = useState([]);
  const [displayPoints, setDisplayPoints] = useState(false); // New state to control the display mode

  useEffect(() => {
    const initializeWebGazer = () => {
      if (window.webgazer) {
        window.webgazer
          .setGazeListener((data, elapsedTime) => {
            if (data) {
              setPredictionPoints((prevPoints) => [...prevPoints, data]);
            }
          })
          .begin()
          .then(() => {
            setWebGazerReady(true);
          });
      }
    };

    document.addEventListener("webgazerLoaded", initializeWebGazer);
    return () => {
      document.removeEventListener("webgazerLoaded", initializeWebGazer);
      window.webgazer && window.webgazer.end(); // Clean up on component unmount
    };
  }, []);

  const setGlobalData = async (key, data) => {
    try {
      await localforage.setItem(key, data);
      console.log(`Data stored successfully under key ${key}`);
    } catch (error) {
      console.error(`Error storing data under key ${key}:`, error);
    }
  };

  const handleCentralPointClick = () => {
    if (clickCount < 20) {
      setClickCount(clickCount + 1);
    } else {
      // Once 20 clicks are reached, switch to display mode
      setDisplayPoints(true);
      console.log("Displaying points", predictionPoints);

      // Save the predictionPoints to localforage
      setGlobalData("webgazerGlobalData", predictionPoints).then(() => {
        console.log("Prediction points have been saved.");
      });
      //stop webgazer
      window.webgazer.end();
    }
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
            ></div>
          ))}
        </div>
      )}
    </>
  );
};

export default SimplifiedCalibration;
