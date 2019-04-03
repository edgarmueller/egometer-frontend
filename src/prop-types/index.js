import PropTypes from "prop-types";

export const chartPropTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string
    })
  ),
  days: PropTypes.array.isRequired,
  schema: PropTypes.shape({
    enum: PropTypes.array
  }).isRequired
};

export const entriesPropType = PropTypes.objectOf(
  PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      meterId: PropTypes.string,
      value: PropTypes.any,
      date: PropTypes.string
    })
  )
);

export const meterPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  schemaId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
});

export const componentPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func
]);

export const widgetPropTypes = PropTypes.shape({
  category: PropTypes.string,
  cell: componentPropType,
  day: componentPropType,
  month: componentPropType,
  icon: PropTypes.node,
  isApplicable: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  schemaId: PropTypes.string.isRequired
});
