import { Button } from "primereact/button";
import React, { useRef } from "react";
import { Controller } from "react-hook-form";

const ImageContainer = ({ imageRef }) => {
  const imputRef = useRef();

  async function previewImage(e) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      let base64Data;
      if (reader.result.includes("data:image/png;base64,")) {
        base64Data = reader.result.replace(/^data:image\/png;base64,/, "");
      } else {
        base64Data = reader.result.replace(/^data:image\/jpeg;base64,/, "");
      }
      imageRef.current.src = "data:image/png;base64," + base64Data;
    });
    reader.readAsDataURL(e.target.files[0]);
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "0",
        width: "98.5%",
        margin: "0px 10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          background: "#f8f9fa",
          padding: "1.5rem",
        }}
      >
        <span
          className="p-button"
          onClick={() => {
            imputRef.current.click();
          }}
        >
          Choose
        </span>

        <input
          type="file"
          hidden
          ref={imputRef}
          accept="image/*"
          onChange={previewImage}
        />

        <Button
          label="Remove"
          severity="danger"
          className="rounded"
          type="button"
          onClick={() => {
            imputRef.current.value = "";
            imageRef.current.src = "";
          }}
        />
      </div>
      <div style={{ padding: "2rem" }}>
        <div>
          <img
            style={{
              overflowClipMargin: "content-box",
              overflow: "clip",
              width: "50px",
            }}
            ref={imageRef}
            src=""
            alt="Image"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ImageContainer);
