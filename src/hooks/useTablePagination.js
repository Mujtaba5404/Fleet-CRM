import { useState } from "react";
import PAGE_SIZES from "../constants/PAGE_SIZES";

const useTablePagination = ({
  initialPage = 1,
  initialPageSize = PAGE_SIZES[1],
  initialSort = { columnAccessor: "createdAt", direction: "desc" },
  resetPageOn = [],
} = {}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortStatus, setSortStatus] = useState(initialSort);

  const sortString =
    sortStatus.direction === "desc"
      ? `-${sortStatus.columnAccessor}`
      : sortStatus.direction === "asc"
        ? sortStatus.columnAccessor
        : undefined;

  // Page 3 of an old filter is meaningless once the filter changes, so reset.
  //
  // This is an adjust-during-render reset rather than an effect: as an effect
  // it fired *after* the table had already committed a render (and a fetch)
  // with the stale page, causing a second render and a wasted request on every
  // filter change.
  const resetKey = `${pageSize}|${JSON.stringify(resetPageOn)}`;
  const [lastResetKey, setLastResetKey] = useState(resetKey);

  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setPage(initialPage);
  }

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    sortStatus,
    setSortStatus,
    sortString,
  };
};

export default useTablePagination;
