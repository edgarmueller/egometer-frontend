export const link = {
  textDecoration: "none",
  color: "#000",
  paddingLeft: "2em",
  paddingRight: "2em",
  height: "28px",
  display: "inline-flex",
  alignItems: "center",
  marginLeft: "1em",
  marginRight: "1em",
  fontWeight: "bold",
  fontSize: "0.875rem",
  "&:hover": {
    backgroundColor: "#000",
    color: "#fff"
  },
  textTransform: "uppercase",
  letterSpacing: "0.065em"
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
    backgroundColor: "#80CBC4",
    color: "#fff"
  },
  alignItems: "center",
  textTransform: "uppercase",
  fontSize: "0.8em",
  letterSpacing: "0.065em"
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
    flex: 1,
    color: "#333435",
    borderRadius: "16px",
    paddingLeft: "2em",
    paddingRight: "2em",
    paddingTop: "1em",
    paddingBottom: "1em",
    marginRight: "1em",
    fontSize: "0.8125em",
    fontWeight: "bold",
    textDecoration: "none",
    fontFamily: "'Arial', sans-serif"
}

export const joinClasses = (...classNames) => `${[...classNames].join(" ")}`;
