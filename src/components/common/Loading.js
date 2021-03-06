import React from "react";
import { MoonLoader } from "react-spinners";

const Loading = () => (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      marginLeft: -40,
      marginTop: -55,
    }}
  >
    <MoonLoader />
  </div>
);

export default Loading;
