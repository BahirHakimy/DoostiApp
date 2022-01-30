import React from "react";
import { Cropper } from "react-cropper";
import { Sbutton as Button, Spinner } from "../../lib";
import Resizer from "react-image-file-resizer";
import "cropperjs/dist/cropper.css";

const Crop = ({
  image,
  onCrop,
  size: { height, width } = { height: 400, width: 400 },
  aspectRatio = 1,
}) => {
  const CropperRef = React.useRef();
  const [pending, setPending] = React.useState(null);

  // Resizer the file to 400x400 size
  function ResizerFile(file) {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        width,
        height,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });
  }
  function handleCrop() {
    setPending(true);
    const cropper = CropperRef.current.cropper;

    if (typeof cropper?.getCroppedCanvas() !== undefined) {
      cropper.getCroppedCanvas().toBlob(
        (blob) => {
          ResizerFile(blob).then((newImage) => {
            setPending(false);
            onCrop(newImage);
          });
        },
        "image/jpeg",
        1
      );
    }
  }
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#ddd",
        height: "auto",
        maxHeight: "90vh",
        overflow: "hidden",
        width: "auto",
        paddingBottom: "1rem",
        borderRadius: "1rem",
        margin: ".5rem 1rem ",
        boxShadow: ".2rem .2rem .5rem #222",
      }}
    >
      <p
        style={{
          position: "absolute",
          bottom: "3rem",
          color: "var(--light)",
          background: "#3335",
          padding: "0 1rem",
          zIndex: "1000",
          borderRadius: ".5rem",
        }}
      >
        Use scroll to zoom in or zoom out
      </p>
      <Cropper
        style={{
          height: "auto",
          margin: "auto",
          maxHeight: "460px",
          width: "max-content",
          display: "block",
          maxWidth: "960px",
        }}
        aspectRatio={aspectRatio}
        responsive={true}
        minCropBoxHeight={height}
        minCropBoxWidth={width}
        zoomTo={0.5}
        viewMode={1}
        dragMode="move"
        cropBoxResizable={false}
        cropBoxMovable={false}
        src={image}
        ref={CropperRef}
      />
      {pending ? (
        <Spinner size="20px" />
      ) : (
        <Button onClick={handleCrop} disabled={!image}>
          Crop
        </Button>
      )}
    </div>
  );
};

export default Crop;
