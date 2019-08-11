export const link = {
  textDecoration: "none",
  color: "#fff",
  alignItems: "center",
  "&:hover": {
    backgroundColor: "rgb(65, 102, 170, 0.5)",
    color: "#fff"
  },
  paddingLeft: "1rem",
  paddingRight: "1rem",
  fontSize: "0.8125rem"
};

export const buttonStyle = {
  fontSize: "2em"
};

export const primaryButton = {
  backgroundColor: "#25a8cb",
  color: "#fff"
};

export const button = {
  textDecoration: "none",
  paddingLeft: "1em",
  paddingRight: "1em",
  display: "inline-flex",
  borderRadius: "4px",
  marginLeft: "1em",
  marginRight: "1em",
  height: "36px",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "rgba(85, 189, 253, 0.4)",
    color: "#fff"
  },
  alignItems: "center",
  fontSize: "0.8em",
  letterSpacing: "0.065em",
  textTransform: 'uppercase'
};

export const underline = {
  display: "block",
  height: ".375rem",
  width: "6rem",
  margin: "0.5rem 0",
  backgroundColor: "#794bc4"
};

export const meterTitle = {
  fontWeight: "bold",
  color: "#000",
  fontSize: 24
};

export const titleWrapper = {
  position: "sticky",
  top: 0,
  background: "rgba(255, 255, 255, 0.75)"
};

export const display1 = {
  marginTop: "0.5em",
  fontSize: "1.5em",
  color: "#000",
  fontWeight: "bold"
};

export const logo = {
  color: "#333435",
  borderRadius: "16px",
  marginRight: "1em",
  fontSize: "0.8125em",
  fontWeight: "bold",
  textDecoration: "none",
  fontFamily: "'Arial', sans-serif"
};

export const joinClasses = (...classNames) => `${[...classNames].join(" ")}`;
