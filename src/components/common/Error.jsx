import React from "react";
import PropTypes from "prop-types";
import Ionicon from "react-ionicons";

const Error = ({ message }) => (
  <div
    style={{
      backgroundColor: "#f73378",
      color: "#fff",
      borderRadius: 10,
      margin: "10px auto 0 auto",
      padding: 10,
      display: "flex",
      alignItems: "center",
      width: "30%"
    }}
  >
    <Ionicon
      icon="md-close-circle"
      style={{ padding: 10 }}
      color="#fff"
      fontSize={"20"}
    />
    <div style={{ fontWeight: "bold" }}>{message}</div>
  </div>
);

Error.propTypes = {
  message: PropTypes.string.isRequired
};

export default Error;
