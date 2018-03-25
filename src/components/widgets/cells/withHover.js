import React from "react";

const withHover = WrappedComponent => {
  class HoverWrapper extends React.Component {
    state = { hover: false };

    toggleHover = () => {
      this.setState({ hover: !this.state.hover });
    };

    render() {
      return (
        <div
          onMouseEnter={() => {
            if (this.state.hover) {
              return;
            }
            this.toggleHover();
          }}
          onMouseOver={() => {
            if (this.state.hover) {
              return;
            }
            this.toggleHover();
          }}
          onMouseLeave={() => {
            if (this.state.hover) {
              this.toggleHover();
            }
          }}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <WrappedComponent {...this.props} hover={this.state.hover} />
        </div>
      );
    }
  }
  HoverWrapper.displayName = "withHover";
  return HoverWrapper;
};

export default withHover;
