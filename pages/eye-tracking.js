import Script from "next/script";
import React, { useEffect, useState, useRef } from "react";

const EyeTrackingComponent = () => {
  const [webGazerReady, setWebGazerReady] = useState(false);
  const focusTimer = useRef(null);
  const focusedElement = useRef(null);

  useEffect(() => {
    //access localforage to see the data being saved

    const initializeWebGazer = () => {
      window.webgazer
        .saveDataAcrossSessions(true)
        .setGazeListener((data, elapsedTime) => {
          if (data == null) {
            return;
          }
          handleGaze(data);
        })
        .begin()
        .then(() => {
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
    // la logica del scroll que iba aca no se va a implementar -> CANCELAR SCROLL
    checkForGazeClick(data); //LOGICA DE CLICK
  };

  const checkForGazeClick = (data) => {
    const elements = document.elementsFromPoint(data.x, data.y);
    const clickable = elements.find((el) => el.classList.contains("clickable"));
    if (clickable && focusedElement.current !== clickable) {
      if (focusTimer.current) clearTimeout(focusTimer.current);
      focusedElement.current = clickable;
      focusTimer.current = setTimeout(() => {
        clickable.click();
        resetFocus();
      }, 3000); // Wait for 3 seconds of focus before clicking
    } else if (!clickable) {
      resetFocus();
    }
  };

  const resetFocus = () => {
    if (focusTimer.current) clearTimeout(focusTimer.current);
    focusTimer.current = null;
    focusedElement.current = null;
  };

  const horizontalContent = (
    <div
      style={{
        display: "flex", // Use flexbox for horizontal layout
        justifyContent: "space-around", // Space out items evenly
        alignItems: "center", // Center items vertically
        height: "90vh", // Adjust height as needed
      }}
    >
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="clickable" // Keep items clickable
          onClick={() => alert(`Item ${index} clicked`)}
          style={{
            width: "30%", // Each item takes up roughly a third of the container width
            height: "80%", // Adjust height as needed
            border: "1px solid #ccc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2em", // Increase font size for visibility
          }}
        >
          Item {index}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Script
        src="/webgazer.js"
        onLoad={() => window.dispatchEvent(new Event("webgazerLoaded"))}
        strategy="lazyOnload"
      />
      {webGazerReady ? (
        <div>
          <div>Eye tracking is ready. Look at items to click them.</div>
          <div style={{ height: "auto", overflowY: "auto" }}>
            {horizontalContent}
          </div>
        </div>
      ) : (
        <div>Loading Eye Tracker...</div>
      )}
    </>
  );
};

export default EyeTrackingComponent;
