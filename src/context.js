import React from "react";

const MeterContext = React.createContext({});
//MeterContext.displayName = "MeterContext";

export const withMeterContext = (Component) => {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <MeterContext.Consumer>
      {(ctxProps) => <Component {...ctxProps} {...props} />}
    </MeterContext.Consumer>
  );
};
withMeterContext.displayName = "withMeterContext";

export { MeterContext };
