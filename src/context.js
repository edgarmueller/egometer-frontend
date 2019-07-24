import React from "react";

const MeterContext = React.createContext({});

export function withMeterContext(Component) {
  return props => (
    <MeterContext.Consumer>
      {ctxProps => <Component {...ctxProps} {...props} />}
    </MeterContext.Consumer>
  );
}

export { MeterContext };
