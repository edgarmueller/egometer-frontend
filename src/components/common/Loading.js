import React from "react";
import { ClipLoader } from "react-spinners";

const Loading = () => (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%"
    }}
  >
    <ClipLoader sizeUnit={"px"} size={150} color={"#123abc"} />
  </div>
);

export default Loading;
