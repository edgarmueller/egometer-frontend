import { lifecycle } from "recompose";

export const fetchSchemasOnMount = lifecycle({
  componentDidMount() {
    this.props.fetchSchemas();
  }
});
