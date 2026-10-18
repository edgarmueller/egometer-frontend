import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEntriesByMeter, getMeters, isMetersLoading } from "../../reducers";

/**
 * The meters and their entries, fetching the entries with the given action
 * whenever its fetchKey changes.
 */
const useDashboardData = (fetchAction, fetchKey) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAction);
    // the action is recreated on each render, the key tells what it fetches
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetchKey]);
  const meters = useSelector(getMeters);
  const entriesByMeter = useSelector(getEntriesByMeter);
  const isLoading = useSelector(
    (state) => state.entries.loadingStatus.isLoading || isMetersLoading(state)
  );
  return { meters, entriesByMeter, isLoading };
};

export default useDashboardData;
