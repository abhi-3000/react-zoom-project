// import React, { useLayoutEffect, useRef } from "react";
// import { gsap } from "gsap";
// import "./ZoomComponent.css";
// import zoomSprite from "./assets/car-zoom.jpg";

// const ZoomComponent = () => {
//   const imageRef = useRef(null);
//   const timelineRef = useRef(null);

//   useLayoutEffect(() => {
//     const TOTAL_PANELS = 4;
//     const SCALE_FACTOR = TOTAL_PANELS;
//     const Y_PERCENT_MOVE = -75;
//     const image = imageRef.current;

//     gsap.set(image, {
//       scale: 1,
//       yPercent: 0,
//       transformOrigin: "top center",
//     });

//     timelineRef.current = gsap
//       .timeline({
//         repeat: -1,
//         ease: "none",
//       })
//       .to(image, {
//         scale: SCALE_FACTOR,
//         yPercent: Y_PERCENT_MOVE,
//         duration: 4,
//       });

//     const handleKeyDown = (e) => {
//       if (e.key === "ArrowUp") {
//         timelineRef.current.timeScale(2.5);
//       } else if (e.key === "ArrowDown") {
//         timelineRef.current.timeScale(0.5);
//       }
//     };

//     const handleKeyUp = () => {
//       timelineRef.current.timeScale(1);
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);

//     return () => {
//       timelineRef.current.kill();
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, []);

//   return (
//     <div className="zoom-container">
//       <img
//         ref={imageRef}
//         src={zoomSprite}
//         alt="Infinite Supercar Zoom"
//         className="zoom-image"
//       />
//     </div>
//   );
// };

// export default ZoomComponent;


import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./ZoomComponent.css";
import carImage from "./assets/car-zoom.jpg";

const ZoomComponent = () => {
  const containerRef = useRef(null);
  const layersRef = useRef([]);
  const timelineRef = useRef(null);
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const CONFIG = {
    LAYERS: 4,
    ZOOM_DURATION: 10,
    SCALE_FACTOR: 4,
    CENTER_X: 50,
    CENTER_Y: 50,
  };

  useLayoutEffect(() => {
    const layers = layersRef.current;

    layers.forEach((layer, i) => {
      gsap.set(layer, {
        scale: Math.pow(CONFIG.SCALE_FACTOR, -i),
        x: 0,
        y: 0,
        opacity: 1,
        transformOrigin: `${CONFIG.CENTER_X}% ${CONFIG.CENTER_Y}%`,
        zIndex: CONFIG.LAYERS - i,
      });
    });

    const createAnimation = () => {
      const tl = gsap.timeline({
        repeat: -1,
        ease: "none",
        onRepeat: () => {
          const firstLayer = layers.shift();
          layers.push(firstLayer);
          layersRef.current = layers;

          gsap.set(firstLayer, {
            scale: Math.pow(CONFIG.SCALE_FACTOR, -(CONFIG.LAYERS - 1)),
            zIndex: 1,
          });

          layers.forEach((layer, i) => {
            gsap.set(layer, { zIndex: CONFIG.LAYERS - i });
          });
        },
      });

      layers.forEach((layer) => {
        tl.to(
          layer,
          {
            scale: `*=${CONFIG.SCALE_FACTOR}`,
            duration: CONFIG.ZOOM_DURATION,
            ease: "none",
          },
          0
        );
      });

      return tl;
    };

    timelineRef.current = createAnimation();

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY;

      if (delta < 0) {
        const newSpeed = Math.min(speed + 0.3, 5);
        setSpeed(newSpeed);
        timelineRef.current.timeScale(newSpeed);
      } else {
        const newSpeed = Math.max(speed - 0.3, 0.1);
        setSpeed(newSpeed);
        timelineRef.current.timeScale(newSpeed);
      }

      setTimeout(() => {
        setSpeed(1);
        gsap.to(timelineRef.current, { timeScale: 1, duration: 1 });
      }, 1500);
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        timelineRef.current.timeScale(3);
        setSpeed(3);
      } else if (e.key === "ArrowDown") {
        timelineRef.current.timeScale(0.3);
        setSpeed(0.3);
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        const paused = !timelineRef.current.paused();
        timelineRef.current.paused(paused);
        setIsPaused(paused);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        gsap.to(timelineRef.current, { timeScale: 1, duration: 0.5 });
        setSpeed(1);
      }
    };

    const container = containerRef.current;
    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [speed]);

  return (
    <div className="zoom-wrapper">
      <div ref={containerRef} className="zoom-container">
        {[...Array(CONFIG.LAYERS)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (layersRef.current[i] = el)}
            className="zoom-layer"
          >
            <img
              src={carImage}
              alt={`Zoom layer ${i + 1}`}
              className="zoom-image"
              draggable="false"
            />
          </div>
        ))}
      </div>

      <div className="controls-panel">
        <div className="controls-header">
          <h2>🚗 Infinite Zoom</h2>
        </div>

        <div className="controls-content">
          <div className="control-item">
            <span className="control-icon">🖱️</span>
            <span className="control-text">Mouse wheel: Control speed</span>
          </div>

          <div className="control-item">
            <span className="control-icon">⬆️</span>
            <span className="control-text">Arrow Up: Speed up</span>
          </div>

          <div className="control-item">
            <span className="control-icon">⬇️</span>
            <span className="control-text">Arrow Down: Slow down</span>
          </div>

          <div className="control-item">
            <span className="control-icon">⎵</span>
            <span className="control-text">Space: Pause/Resume</span>
          </div>
        </div>

        <div className="speed-display">
          <div className="speed-label">Current Speed</div>
          <div className="speed-value">{speed.toFixed(1)}x</div>
          {isPaused && <div className="paused-indicator">⏸ PAUSED</div>}
        </div>
      </div>

      <div className="credits">
        <p>Infinite Droste Zoom Effect</p>
        <p>Made for CVNT Assignment</p>
      </div>
    </div>
  );
};

export default ZoomComponent;
