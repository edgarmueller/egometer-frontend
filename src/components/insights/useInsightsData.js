import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import groupBy from "lodash/groupBy";
import * as api from "../../api";
import { getMeters } from "../../reducers";

/**
 * The meters and their entries of the last given number of days, fetched
 * apart from the store, which only holds the entries of the dashboards.
 */
const useInsightsData = (days) => {
  const meters = useSelector(getMeters);
  const [state, setState] = useState({ isLoading: true });
  useEffect(() => {
    let isCurrent = true;
    const to = moment();
    const from = moment(to).subtract(days - 1, "days");
    setState({ isLoading: true });
    api
      .fetchEntriesInRange(from.format("YYYY-MM-DD"), to.format("YYYY-MM-DD"))
      .then(
        ({ data }) =>
          isCurrent &&
          setState({
            isLoading: false,
            entriesByMeter: groupBy(data, "meterId"),
          }),
        (error) => isCurrent && setState({ isLoading: false, error })
      );
    return () => {
      isCurrent = false;
    };
  }, [days]);
  return { meters, ...state };
};

export default useInsightsData;
