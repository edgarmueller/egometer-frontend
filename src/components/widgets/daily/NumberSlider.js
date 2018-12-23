import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Slider from '@material-ui/lab/Slider';
import ConnectedComponent from "../../common/ConnectedComponent";
import TitleBar from "./TitleBar";

//  TODO duplicate
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export class NumberSlider extends React.Component {
    render() {
        const { date, data, meter, updateEntry, isLoading, icon, min, max, step } = this.props;

        const journalEntry = _.find(data, d => d.date === date);

        return (
            <ConnectedComponent
                meter={meter}
                fromEvent={ev => {
                    const val = ev.target.value;
                    const isNumber = isNumeric(val);
                    return isNumber ? _.toNumber(val) : val;
                }}
                isLoading={isLoading}
                data={(journalEntry && journalEntry.value) || undefined}
                date={date}
                updateOnChange
                updateEntry={updateEntry}
                fromEvent={x => x}
                inputComponent={({ handleOnChange, data: number }) => {
                    const onChannge = (ev, value) => {
                        handleOnChange(value)
                    }
                    return (
                        <div>
                            <TitleBar meter={meter} icon={icon} />
                            <Slider
                                style={{ paddingTop: '1.5em' }}
                                value={number}
                                min={min}
                                max={max}
                                step={step}
                                onChange={onChannge}
                            />
                            {number}
                        </div>
                    );
                }}
            />
        );
    }
}

NumberSlider.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    date: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    updateEntry: PropTypes.func.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number
};

NumberSlider.defaultProps = {
    step: 1
}

export default NumberSlider;

export const withMinMaxStep = ({ min, max, step }) => (Component) => {
    class WrappedComponent extends React.Component {
        render() {
            return (
                <Component
                    min={min}
                    max={max}
                    step={step}
                    {...this.props}
                />
            )
        }
    }
    WrappedComponent.displayName = 'sliderConfig'
    return WrappedComponent;
}