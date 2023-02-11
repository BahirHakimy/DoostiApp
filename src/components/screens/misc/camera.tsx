import React from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import Webcam from "react-webcam";
import "../../styles/camera.css";

const Camera = ({ onCapture, onClose }) => {
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  return (
    <div id="parentFullContainer">
      <div id="cameraContainer">
        <div id="cameraWrapper">
          <Webcam
            mirrored={true}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            id="camera"
          />
          <button id="cameraShotButton" onClick={capture}>
            <FaCamera size="25px" />
          </button>
          <button id="cameraCloseButton" onClick={onClose}>
            <FaTimes size="25px" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Camera;

// https://www.npmjs.com/package/react-webcam
