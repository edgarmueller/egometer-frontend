import React from "react";
import _ from "lodash";

export const withLabels = labelProvider => Component => {
  class WrappedComponent extends React.Component {
    render() {
      return <Component {...this.props} labelProvider={labelProvider} />;
    }
  }
  WrappedComponent.displayName = "withLabels";
  return WrappedComponent;
};

export const literalLabelProvider = obj => key => obj[key];

export const defaultLiteralLabelProvider = literal => {
  return _.startCase(_.replace(literal, "_", " "));
};

export const withImages = imageProvider => Component => {
  class WrappedComponent extends React.Component {
    render() {
      return <Component {...this.props} imageProvider={imageProvider} />;
    }
  }
  WrappedComponent.displayName = "withImages";
  return WrappedComponent;
};
