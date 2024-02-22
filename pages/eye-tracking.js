import Script from "next/script";
import React, { useEffect, useState } from "react";

const EyeTrackingComponent = () => {
  const [webGazerReady, setWebGazerReady] = useState(false);

  useEffect(() => {
    // Function to initialize WebGazer
    const initializeWebGazer = () => {
      window.webgazer
        .setGazeListener((data, elapsedTime) => {
          if (data == null) {
            return;
          }
          console.log(data, elapsedTime);
        })
        .begin()
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
          Eye tracking is ready. Look at this text, and your gaze will be
          tracked.
        </div>
      ) : (
        <div>Loading Eye Tracker...</div>
      )}
    </>
  );
};

export default EyeTrackingComponent;
