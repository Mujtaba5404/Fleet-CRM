import {
  Badge,
  Button,
  Divider,
  Group,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useGetMaintenanceWithPaginationQuery } from "../../api/maintenance";
import NoteHoverCell from "../../components/NoteHoverCell";
import PaginatedTable from "../../components/PaginatedTable";
import useFilters from "../../hooks/useFilters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import PicklistsMultiSelect from "../picklists/components/PicklistsMultiSelect";
import { MAINTENANCE_STATUS_OPTIONS } from "./maintenanceForm";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";
import MaintenanceTableRowMenu from "./MaintenanceTableRowMenu";

const photoCount = (row) =>
  (row.conditionBefore?.length || 0) + (row.conditionAfter?.length || 0);

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

const picklistFilter = (field, filters, setFilters) => ({
  filter: (
    <PicklistsMultiSelect
      queryObject={{ resource: "Maintenance", field }}
      multiSelectProps={{
        size: "xs",
        placeholder: `Select ${field}`,
        value: filters[field] || [],
        onChange: (value) => setFilters({ [field]: value }),
        comboboxProps: { withinPortal: false },
      }}
    />
  ),
  filtering: filters[field]?.length,
});

const DEFAULT_COLUMNS = (filters, setFilters) => [
  {
    accessor: "createdAt",
    title: "Logged",
    width: 120,
    textAlign: "center",
    sortable: true,
    filter: ({ close }) => (
      <Stack gap="xs">
        <DatePicker
          size="xs"
          type="range"
          value={filters.createdAt}
          onChange={(value) => setFilters({ createdAt: value })}
        />
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
    filter: (
      <TextInput
        size="xs"
        placeholder="Search by plate"
        value={filters.licensePlate || ""}
        onChange={(e) => setFilters({ licensePlate: e.target.value })}
      />
    ),
    filtering: filters.licensePlate,
    render: (row) =>
      row.fleet ? (
        <UnstyledButton component={Link} to={`/fleets/${row.fleet._id}`}>
          <Badge variant="light" tt="uppercase">
            {row.fleet.licensePlate || "-"}
          </Badge>

          <Text size="xs" c="dimmed" tt="capitalize" mt={2}>
            {[row.fleet.year, row.fleet.color].filter(Boolean).join(" · ") ||
              "-"}
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
    ...picklistFilter("type", filters, setFilters),
    render: (row) => (
      <TwoLine top={row.type?.title} bottom={row.vendor?.title} />
    ),
  },
  {
    accessor: "status",
    width: 140,
    textAlign: "center",
    filter: (
      <MultiSelect
        size="xs"
        placeholder="Select status"
        data={MAINTENANCE_STATUS_OPTIONS.map(({ value, label }) => ({
          value,
          label,
        }))}
        value={filters.status || []}
        onChange={(value) => setFilters({ status: value })}
        comboboxProps={{ withinPortal: false }}
      />
    ),
    filtering: filters.status?.length,
    render: (row) => <MaintenanceStatusBadge status={row.status} />,
  },
  {
    accessor: "priority",
    width: 120,
    textAlign: "center",
    ...picklistFilter("priority", filters, setFilters),
    render: (row) => (
      <Badge variant="light" color={row.priority?.color} tt="capitalize">
        {row.priority?.title || "-"}
      </Badge>
    ),
  },
  {
    accessor: "startDate",
    title: "Schedule",
    width: 150,
    sortable: true,
    render: (row) => (
      <TwoLine
        top={row.startDate ? formatDate(row.startDate) : "-"}
        bottom={row.endDate ? `Ends ${formatDate(row.endDate)}` : "Open"}
      />
    ),
  },
  {
    accessor: "photos",
    title: "Photos",
    width: 120,
    textAlign: "center",
    render: (row) =>
      photoCount(row) ? (
        <TwoLine
          top={`${row.conditionBefore?.length || 0} before`}
          bottom={`${row.conditionAfter?.length || 0} after`}
        />
      ) : (
        <Text size="sm" c="dimmed">
          -
        </Text>
      ),
  },
  {
    accessor: "odometer",
    width: 120,
    textAlign: "center",
    sortable: true,
    render: (row) =>
      row.odometer != null ? row.odometer.toLocaleString() : "-",
  },
  {
    accessor: "cost",
    width: 140,
    sortable: true,
    render: (row) => (
      <Text size="sm" className="numeric">
        {formatAmount(row.cost || 0)}
      </Text>
    ),
  },
  {
    accessor: "checklist",
    title: "Check List",
    width: 200,
    render: (row) =>
      row.checklist?.length ? (
        <Group gap={4}>
          {row.checklist.map((check, index) => (
            <Badge
              key={index}
              variant="light"
              color={check.status?.color || "gray"}
              tt="capitalize"
            >
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
      <NoteHoverCell
        note={row.notes}
        author={row.createdBy}
        date={row.updatedAt || row.createdAt}
      />
    ),
  },
  {
    accessor: "menu",
    width: 60,
    textAlign: "center",
    render: (row) => <MaintenanceTableRowMenu maintenance={row} compact />,
  },
];

/** Compact card shown instead of a table row on phones. */
const MaintenanceCard = (row) => (
  <Stack gap="sm">
    <Group justify="space-between" wrap="nowrap" align="flex-start">
      <UnstyledButton
        component={Link}
        to={`/maintenance/${row._id}`}
        style={{ minWidth: 0 }}
      >
        <Text size="sm" fw={600} tt="capitalize" truncate>
          {row.type?.title || "Maintenance job"}
        </Text>

        <Group gap={6} mt={4}>
          {row.fleet?.licensePlate && (
            <Badge size="sm" color="gray" tt="uppercase">
              {row.fleet.licensePlate}
            </Badge>
          )}

          <Text size="xs" c="dimmed" tt="capitalize">
            {row.vendor?.title || "No vendor"}
          </Text>
        </Group>
      </UnstyledButton>

      <MaintenanceTableRowMenu maintenance={row} compact />
    </Group>

    <Group gap={6}>
      {row.status && <MaintenanceStatusBadge status={row.status} />}

      {photoCount(row) > 0 && (
        <Badge size="sm" color="gray">
          {photoCount(row)} photos
        </Badge>
      )}

      {row.priority?.title && (
        <Badge size="sm" color={row.priority.color} tt="capitalize">
          {row.priority.title}
        </Badge>
      )}

      {row.checklist?.length > 0 && (
        <Badge size="sm" color="gray">
          {row.checklist.length} checks
        </Badge>
      )}
    </Group>

    <Divider />

    <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
      <TwoLine top={formatAmount(row.cost || 0)} bottom="Cost" />
      <TwoLine top={row.odometer?.toLocaleString()} bottom="Odometer" />
      <TwoLine
        top={row.startDate ? formatDate(row.startDate) : "-"}
        bottom="Started"
      />
      <TwoLine
        top={row.endDate ? formatDate(row.endDate) : "Open"}
        bottom="Ends"
      />
    </SimpleGrid>
  </Stack>
);

/**
 * `queryHook` swaps the data source (e.g. one vehicle's jobs on its detail
 * screen) while keeping the same columns, filters and row menu.
 */
const MaintenanceTable = ({
  query,
  hideColumns = [],
  toolbar,
  queryHook = useGetMaintenanceWithPaginationQuery,
}) => {
  const [globalFilters] = useLocalStorage({
    key: "globalFilters",
    getInitialValueInEffect: false,
  });
  const { filters, setFilters } = useFilters({});

  return (
    <PaginatedTable
      queryHook={queryHook}
      columns={DEFAULT_COLUMNS(filters, setFilters)}
      queryParams={{ ...globalFilters, ...filters, ...query }}
      hideColumns={hideColumns}
      mobileCard={MaintenanceCard}
      toolbar={toolbar}
    />
  );
};

export default MaintenanceTable;
