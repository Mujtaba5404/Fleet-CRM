import { Badge, Button, Group, Stack, Text, TextInput, UnstyledButton } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useGetMaintenanceWithPaginationQuery } from "../../api/maintenance";
import PaginatedTable from "../../components/PaginatedTable";
import useFilters from "../../hooks/useFilters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import MaintenanceTableRowMenu from "./MaintenanceTableRowMenu";

const TwoLine = ({ top, bottom }) => (
  <Stack gap={0}>
    <Text size="sm" tt="capitalize">
      {top || "-"}
    </Text>
    <Text size="xs" c="dimmed" tt="capitalize">
      {bottom || "-"}
    </Text>
  </Stack>
);

// const picklistFilter = (field, filters, setFilters) => ({
//   filter: (
//     <PicklistsMultiSelect
//       queryObject={{ resource: "Maintenance", field }}
//       multiSelectProps={{
//         size: "xs",
//         placeholder: `Select ${field}`,
//         value: filters[field] || [],
//         onChange: (value) => setFilters({ [field]: value }),
//         comboboxProps: { withinPortal: false },
//       }}
//     />
//   ),
//   filtering: filters[field]?.length,
// });

const DEFAULT_COLUMNS = (filters, setFilters) => [
  {
    accessor: "createdAt",
    title: "Logged",
    width: 120,
    textAlign: "center",
    sortable: true,
    filter: ({ close }) => (
      <Stack gap="xs">
        <DatePicker size="xs" type="range" value={filters.createdAt} onChange={(value) => setFilters({ createdAt: value })} />
        <Button
          size="xs"
          onClick={() => {
            setFilters({ createdAt: [] });
            close();
          }}
        >
          Clear
        </Button>
      </Stack>
    ),
    filtering: filters.createdAt?.length,
    render: (row) => formatDate(row.createdAt),
  },
  {
    accessor: "fleet",
    title: "Vehicle",
    width: 180,
    filter: <TextInput size="xs" placeholder="Search by plate" value={filters.licensePlate || ""} onChange={(e) => setFilters({ licensePlate: e.target.value })} />,
    filtering: filters.licensePlate,
    render: (row) =>
      row.fleet ? (
        <UnstyledButton component={Link} to={`/fleets/${row.fleet._id}`}>
          <Badge variant="light" tt="uppercase">
            {row.fleet.licensePlate || "-"}
          </Badge>

          <Text size="xs" c="dimmed" tt="capitalize" mt={2}>
            {[row.fleet.year, row.fleet.color].filter(Boolean).join(" · ") || "-"}
          </Text>
        </UnstyledButton>
      ) : (
        <Text size="sm" c="dimmed">
          -
        </Text>
      ),
  },
  {
    accessor: "type",
    width: 150,
    // ...picklistFilter("type", filters, setFilters),
    render: (row) => <TwoLine top={row.type?.title} bottom={row.provider?.title} />,
  },
  {
    accessor: "status",
    width: 130,
    textAlign: "center",
    // ...picklistFilter("status", filters, setFilters),
    render: (row) => (
      <Badge color={row.status?.color} tt="capitalize">
        {row.status?.title || "-"}
      </Badge>
    ),
  },
  {
    accessor: "priority",
    width: 120,
    textAlign: "center",
    // ...picklistFilter("priority", filters, setFilters),
    render: (row) => (
      <Badge variant="light" color={row.priority?.color} tt="capitalize">
        {row.priority?.title || "-"}
      </Badge>
    ),
  },
  {
    accessor: "startedDate",
    title: "Schedule",
    width: 150,
    sortable: true,
    render: (row) => <TwoLine top={row.startedDate ? formatDate(row.startedDate) : "-"} bottom={row.endDate ? `Ends ${formatDate(row.endDate)}` : "Open"} />,
  },
  {
    accessor: "odometer",
    width: 120,
    textAlign: "center",
    sortable: true,
    render: (row) => (row.odometer != null ? row.odometer.toLocaleString() : "-"),
  },
  {
    accessor: "cost",
    width: 140,
    sortable: true,
    render: (row) => <TwoLine top={formatAmount(row.cost || 0)} bottom={`${row.components?.length || 0} parts`} />,
  },
    {
    accessor: "checklist",
    title: "Check List",
    width: 200,
    render: (row) =>
      row.checklist?.length ? (
        <Group gap={4}>
          {row.checklist.map((check, index) => (
            <Badge key={index} variant="light" color={check.status?.color || "gray"} tt="capitalize">
              {check.item?.title || "-"}
            </Badge>
          ))}
        </Group>
      ) : (
        <Text size="sm" c="dimmed">
          -
        </Text>
      ),
  },
  {
    accessor: "notes",
    width: 220,
    render: (row) => (
      <Text size="xs" c="dimmed" lineClamp={2}>
        {row.notes || "-"}
      </Text>
    ),
  },
  {
    accessor: "menu",
    width: 60,
    textAlign: "center",
    render: (row) => <MaintenanceTableRowMenu maintenance={row} compact />,
  },
];

const MaintenanceTable = ({ query, hideColumns = [] }) => {
  const [globalFilters] = useLocalStorage({
    key: "globalFilters",
    getInitialValueInEffect: false,
  });
  const { filters, setFilters } = useFilters({});

  return (
    <PaginatedTable
      queryHook={useGetMaintenanceWithPaginationQuery}
      columns={DEFAULT_COLUMNS(filters, setFilters)}
      queryParams={{ ...globalFilters, ...filters, ...query }}
      hideColumns={hideColumns}
    />
  );
};

export default MaintenanceTable;