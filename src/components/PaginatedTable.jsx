import { IconFiles, IconX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import PAGE_SIZES from "../constants/PAGE_SIZES";
import useTablePagination from "../hooks/useTablePagination";

const DEFAULT_TABLE_PROPS = {
  withColumnBorders: true,
  withRowBorders: true,
  withTableBorder: true,
  borderRadius: "md",
  pinLastColumn: true,
  rowStyle: () => ({ height: 50 }),
};

/**
 * @typedef {Object} PaginatedTableProps
 *
 * @property {Function} queryHook
 * RTK Query hook used to fetch paginated data.
 *
 * Expected API call shape:
 * queryHook({
 *   page,
 *   pageSize,
 *   sort,
 *   query
 * })
 *
 *
 * @property {Object} [queryParams]
 * Additional parameters passed to the API query.
 *
 * Example:
 * { brand: ["id1"], marketingExecutive: ["id2"] }
 *
 * @property {Array} columns
 * Mantine DataTable column definitions.
 *
 * @property {Array<string>} [hideColumns]
 * List of column accessors to hide.
 *
 * @property {boolean} [enableSelection]
 * Enables row selection.
 *
 * @property {Array<Object>} [selectedRecords]
 * Currently selected rows.
 *
 * @property {Function} [onSelectedRecordsChange]
 * Callback triggered when selected rows change.
 *
 * @property {Object} [tableProps]
 * Additional props forwarded to Mantine DataTable.
 */

/**
 * Generic reusable paginated data table.
 *
 * Features:
 * - Server side pagination
 * - Server side sorting
 * - Optional row selection
 * - Optional column hiding
 * - Smart height handling
 *
 * @param {PaginatedTableProps} props
 */
const PaginatedTable = ({ queryHook, queryParams = {}, columns, hideColumns = [], enableSelection = false, selectedRecords, onSelectedRecordsChange, tableProps = {} }) => {
  const { page, setPage, pageSize, setPageSize, sortStatus, setSortStatus, sortString } = useTablePagination({ resetPageOn: [queryParams] });

  const { data, isLoading, isError, error } = queryHook({ page, pageSize, sort: sortString, query: queryParams });

  const records = data?.data ?? [];
  const totalRecords = data?.meta?.totalCount ?? 0;

  const visibleColumns = columns.filter((col) => !hideColumns.includes(col.accessor));

  const tableHeight = records.length > 10 ? 550 : undefined;
  const minHeight = !totalRecords ? 200 : undefined;

  return (
    <DataTable
      {...DEFAULT_TABLE_PROPS}
      {...tableProps}
      idAccessor="_id"
      fetching={isLoading}
      columns={visibleColumns}
      height={tableHeight}
      minHeight={minHeight}
      page={page}
      onPageChange={setPage}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      records={records}
      totalRecords={totalRecords}
      recordsPerPage={pageSize}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      {...(enableSelection && { selectedRecords, onSelectedRecordsChange })}
      noRecordsIcon={isError ? <IconX size={50} /> : <IconFiles size={50} />}
      noRecordsText={isError ? error?.message || "Error loading records" : "No records to display"}
    />
  );
};

export default PaginatedTable;
