import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import RGL, { WidthProvider } from "react-grid-layout";
import { LAYOUT_STORAGE_KEY } from "../../constants";

const ReactGridLayout = WidthProvider(RGL);

const ROW_HEIGHT = 150;

const generateLayout = items => {
  let layout = {};
  if (localStorage && localStorage.getItem(LAYOUT_STORAGE_KEY)) {
    layout = JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY));
  }
  return _.map(items, function(item, i) {
    const y = 2;
    if (!_.isEmpty(layout) && !_.isEmpty(layout[i])) {
      return layout[i];
    }
    return {
      x: (i * 4) % 12,
      y: Math.floor(i / 3) * y,
      w: item.w || 4,
      h: item.h || 2,
      i: i.toString(),
      isDraggable: true,
      isResizable: false
    };
  });
};

class BasicLayout extends React.PureComponent {
  static defaultProps = {
    onLayoutChange: function() {}
  };

  constructor(props) {
    super(props);
    this.state = {
      layout:
        localStorage && localStorage.getItem("egometer.layout")
          ? JSON.parse(localStorage.getItem("egometer.layout"))
          : generateLayout(props.items),
      items: props.items
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!_.isEqual(this.props.items, prevProps.items)) {
      this.setState({ items: this.props.items });
      this.updateLayout();
    } else if (!_.isEqual(this.state.items, prevState.items)) {
      this.updateLayout();
    }
  }

  updateLayout = () => {
    const layout = generateLayout(
      this.state.items.length > 0 ? this.state.items : this.props.items
    );
    this.setState({ layout });
  };

  onLayoutChange = layout => {
    if (layout.length === this.state.layout.length && localStorage) {
      localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
    }
  };

  render() {
    const len = this.props.items.length;
    if (len === 0) {
      return <div>No items defined here.</div>;
    }

    const { children } = this.props;
    return (
      <ReactGridLayout
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        draggableCancel="input,textarea"
        rowHeight={ROW_HEIGHT}
        {...this.props}
      >
        {children}
      </ReactGridLayout>
    );
  }
}

BasicLayout.propTypes = {
  items: PropTypes.array
};

BasicLayout.defaultProps = {
  items: []
};

export default BasicLayout;
