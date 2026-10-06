import {
  Center,
  Group,
  Loader,
  Pagination,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconFiles, IconX } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import PAGE_SIZES from "../constants/PAGE_SIZES";
import useTablePagination from "../hooks/useTablePagination";
import Placeholder from "./Placeholder";

const DEFAULT_TABLE_PROPS = {
  // Grid lines on both axes: with this many numeric columns, row stripes alone
  // do not tell you where one cell ends and the next begins. They are kept
  // hairline-light in index.css so the grid guides without weighing rows down.
  withColumnBorders: true,
  withRowBorders: true,
  withTableBorder: true,
  highlightOnHover: true,
  borderRadius: "md",
  shadow: "xs",
  verticalSpacing: 6,
  horizontalSpacing: "md",
  pinLastColumn: true,
  rowStyle: () => ({ height: 52 }),
};

/**
 * @typedef {Object} PaginatedTableProps
 *
 * @property {Function} queryHook
 * React Query hook used to fetch paginated data.
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
 * @property {Function} [mobileCard]
 * Renders one record as a card. When provided, narrow viewports get a card
 * list instead of a horizontally scrolling table. Receives the record.
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
 * - Card layout on small screens
 * - Smart height handling
 *
 * @param {PaginatedTableProps} props
 */
const PaginatedTable = ({
  queryHook,
  queryParams = {},
  columns,
  hideColumns = [],
  mobileCard,
  toolbar,
  enableSelection = false,
  selectedRecords,
  onSelectedRecordsChange,
  tableProps = {},
}) => {
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    sortStatus,
    setSortStatus,
    sortString,
  } = useTablePagination({ resetPageOn: [queryParams] });

  const isMobile = useMediaQuery("(max-width: 48em)");

  const { data, isLoading, isError, error } = queryHook({
    page,
    pageSize,
    sort: sortString,
    query: queryParams,
  });

  const records = data?.data ?? [];
  const totalRecords = data?.meta?.totalCount ?? 0;

  const visibleColumns = columns.filter(
    (col) => !hideColumns.includes(col.accessor),
  );

  const tableHeight = records.length > 10 ? 550 : undefined;
  const minHeight = !totalRecords ? 200 : undefined;

  // The toolbar sits above both layouts so it can report real record counts.
  const header = toolbar?.({ totalRecords, isLoading });

  // ---- Card list: same data, same pagination, thumb friendly ----
  if (isMobile && mobileCard) {
    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    let body;

    if (isLoading) {
      body = (
        <Center h={200}>
          <Loader />
        </Center>
      );
    } else if (isError) {
      body = (
        <Placeholder
          title={error?.message || "Error loading records"}
          icon={<IconX size={40} />}
        />
      );
    } else if (!records.length) {
      body = (
        <Placeholder
          title="No records to display"
          icon={<IconFiles size={40} />}
        />
      );
    }

    if (body) {
      return (
        <Stack gap="sm">
          {header}
          {body}
        </Stack>
      );
    }

    return (
      <Stack gap="sm">
        {header}

        {records.map((record) => (
          <Paper key={record._id} p="md">
            {mobileCard(record)}
          </Paper>
        ))}

        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Group gap="xs" wrap="nowrap">
            <Text fz="xs" c="dimmed">
              Per page
            </Text>

            <Select
              size="xs"
              w={80}
              searchable={false}
              value={String(pageSize)}
              data={PAGE_SIZES.map(String)}
              onChange={(value) => setPageSize(Number(value))}
              comboboxProps={{ withinPortal: true }}
            />
          </Group>

          <Text fz="xs" c="dimmed">
            {totalRecords} record{totalRecords === 1 ? "" : "s"}
          </Text>

          <Pagination
            size="sm"
            total={totalPages}
            value={page}
            onChange={setPage}
            siblings={0}
            withEdges
          />
        </Group>
      </Stack>
    );
  }

  return (
    <Stack gap="sm">
      {header}

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
        noRecordsText={
          isError
            ? error?.message || "Error loading records"
            : "No records to display"
        }
      />
    </Stack>
  );
};

export default PaginatedTable;
