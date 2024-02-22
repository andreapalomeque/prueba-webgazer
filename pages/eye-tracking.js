import Script from "next/script";
import React, { useEffect, useState } from "react";

const EyeTrackingComponent = () => {
  const [webGazerReady, setWebGazerReady] = useState(false);

  useEffect(() => {
    const initializeWebGazer = () => {
      window.webgazer
        .setGazeListener((data, elapsedTime) => {
          if (data == null) {
            return;
          }
          handleGaze(data);
          console.log(data, elapsedTime); //? elapsed time -> tiempo transcurrido
        })
        .begin() //!starts the data collection that enables the predictions
        .then(() => {
          console.log("WebGazer has started.");
          setWebGazerReady(true);
        });
    };

    if (window.webgazer) {
      initializeWebGazer();
    } else {
      window.addEventListener("webgazerLoaded", initializeWebGazer);
    }

    return () => {
      window.removeEventListener("webgazerLoaded", initializeWebGazer);
    };
  }, []);

  const handleGaze = (data) => {
    // Define trigger zones for scrolling (e.g., top 10% and bottom 10% of the viewport)
    const triggerZoneSize = window.innerHeight * 0.1; // 10% of the viewport height
    if (data.y < triggerZoneSize) {
      // Gaze is in the top trigger zone, scroll up
      window.scrollBy(0, -10); // Adjust the scrolling speed as needed
    } else if (data.y > window.innerHeight - triggerZoneSize) {
      // Gaze is in the bottom trigger zone, scroll down
      window.scrollBy(0, 10); // Adjust the scrolling speed as needed
    }
  };

  // Generate a list of items to scroll through
  const scrollableContent = Array.from({ length: 100 }).map((_, index) => (
    <div
      key={index}
      style={{ padding: "10px", border: "1px solid #ccc", margin: "5px 0" }}
    >
      Item {index + 1}
    </div>
  ));

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
        <div>
          <div>
            Eye tracking is ready. Look at this text, and your gaze will be
            tracked.
          </div>
          {/* Render scrollable content inside a container with a fixed height and overflow set to auto */}
          <div style={{ height: "auto", overflowY: "auto" }}>
            {scrollableContent}
          </div>
        </div>
      ) : (
        <div>Loading Eye Tracker...</div>
      )}
    </>
  );
};

export default EyeTrackingComponent;
