import { useEffect, useState } from "react";
import PAGE_SIZES from "../constants/PAGE_SIZES";

const useTablePagination = ({ initialPage = 1, initialPageSize = PAGE_SIZES[1], initialSort = { columnAccessor: "createdAt", direction: "desc" }, resetPageOn = [] } = {}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortStatus, setSortStatus] = useState(initialSort);

  const sortString = sortStatus.direction === "desc" ? `-${sortStatus.columnAccessor}` : sortStatus.direction === "asc" ? sortStatus.columnAccessor : undefined;

  useEffect(() => {
    setPage(initialPage);
  }, [pageSize, JSON.stringify(resetPageOn)]);

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
