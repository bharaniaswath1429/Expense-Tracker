import React from "react";

const Circle = (props) => {

  return (
    <div
      className="p-4 d-flex align-items-center justify-content-center"
      style={{
        height: "200px",
        width: "200px",
        borderRadius: "50%",
        backgroundColor: "#6c63ff",
      }}
    >
      <div
        className="bg-white d-flex align-items-center justify-content-center"
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          backgroundColor: "#6c63ff",
        }}
      >
        <div>
          <p className="m-0">{props.name}</p>
          <h3 className="fw-bold d-flex align-items-center justify-content-center">
            {props.data}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Circle;
