import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Slider from "@material-ui/lab/Slider";
import ConnectedComponent from "../../common/ConnectedComponent";
import TitleBar from "./TitleBar";

export class NumberSlider extends React.Component {
  render() {
    const { date, data, meter, isLoading, icon, min, max, step } = this.props;

    const entry = _.find(data, d => d.date === date);

    return (
      <ConnectedComponent
        meterId={meter.id}
        isLoading={isLoading}
        data={(entry && entry.value) || undefined}
        date={date}
        updateOnChange
        fromEvent={x => x}
      >
        {({ updateValue, data: number }) => {
          const onChannge = useCallback(
            (ev, value) => {
              updateValue(value);
            },
            [updateValue]
          );
          return (
            <div>
              <TitleBar meter={meter} icon={icon} />
              <Slider
                style={{ padding: "1em" }}
                value={Number(number)}
                min={min}
                max={max}
                step={step}
                onChange={onChannge}
              />
              {number}
            </div>
          );
        }}
      </ConnectedComponent>
    );
  }
}

NumberSlider.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  date: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number
};

NumberSlider.defaultProps = {
  step: 1
};

export default NumberSlider;

export const withMinMaxStep = ({ min, max, step }) => Component => {
  class WrappedComponent extends React.Component {
    render() {
      return <Component min={min} max={max} step={step} {...this.props} />;
    }
  }
  WrappedComponent.displayName = "sliderConfig";
  return WrappedComponent;
};
