import {
  Badge,
  Button,
  Divider,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useGetfleetsWithPaginationQuery } from "../../api/fleet";
import PaginatedTable from "../../components/PaginatedTable";
import useFilters from "../../hooks/useFilters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import FleetTableRowMenu from "./FleetTableRowMenu";

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
//       queryObject={{ resource: "Fleet", field }}
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
    title: "Date",
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
    accessor: "licensePlate",
    title: "Plate",
    width: 140,
    textAlign: "center",
    sortable: true,
    filter: (
      <TextInput
        size="xs"
        placeholder="Search by plate"
        value={filters.licensePlate || ""}
        onChange={(e) => setFilters({ licensePlate: e.target.value })}
      />
    ),
    filtering: filters.licensePlate,
    render: (row) => (
      <Badge variant="light" tt="uppercase">
        {row.licensePlate || "-"}
      </Badge>
    ),
  },
  {
    accessor: "vehicle",
    width: 200,
    // ...picklistFilter("make", filters, setFilters),
    render: (row) => (
      <UnstyledButton component={Link} to={`/fleets/${row._id}`}>
        <Text size="sm" tt="capitalize">
          {[row.make?.title, row.model?.title].filter(Boolean).join(" ") || "-"}
        </Text>
        <Text size="xs" c="dimmed" tt="capitalize">
          {[row.year, row.color].filter(Boolean).join(" · ") || "-"}
        </Text>
      </UnstyledButton>
    ),
  },
  {
    accessor: "type",
    width: 150,
    // ...picklistFilter("type", filters, setFilters),
    render: (row) => (
      <TwoLine top={row.type?.title} bottom={row.fuelType?.title} />
    ),
  },
  {
    accessor: "transmission",
    width: 130,
    textAlign: "center",
    // ...picklistFilter("transmission", filters, setFilters),
    render: (row) => (
      <Text size="sm" tt="capitalize">
        {row.transmission?.title || "-"}
      </Text>
    ),
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
    accessor: "attachments",
    title: "Files",
    width: 90,
    textAlign: "center",
    render: (row) =>
      row.attachments?.length ? (
        <Badge variant="light" color="gray">
          {row.attachments.length}
        </Badge>
      ) : (
        <Text size="sm" c="dimmed">
          -
        </Text>
      ),
  },
  {
    accessor: "condition",
    width: 120,
    textAlign: "center",
    render: (row) => (
      <Badge color={row.condition?.color} tt="capitalize">
        {row.condition?.title || "-"}
      </Badge>
    ),
  },
  {
    accessor: "purchaseAmount",
    title: "Purchase",
    width: 150,
    sortable: true,
    render: (row) => (
      <TwoLine
        top={formatAmount(row.purchaseAmount || 0)}
        bottom={formatDate(row.purchaseDate)}
      />
    ),
  },
  {
    accessor: "rent",
    width: 120,
    sortable: true,
    render: (row) => (row.rent ? formatAmount(row.rent) : "-"),
  },
  {
    accessor: "currentOdometer",
    title: "Odometer",
    width: 140,
    sortable: true,
    render: (row) => (
      <TwoLine
        top={row.currentOdometer?.toLocaleString()}
        bottom={`Initial: ${row.initialOdometer?.toLocaleString() || "-"}`}
      />
    ),
  },
  {
    accessor: "assignedOn",
    title: "Assigned",
    width: 120,
    textAlign: "center",
    sortable: true,
    render: (row) => (row.assignedOn ? formatDate(row.assignedOn) : "-"),
  },
  {
    accessor: "menu",
    width: 60,
    textAlign: "center",
    render: (row) => <FleetTableRowMenu fleet={row} compact />,
  },
];

/** Compact card shown instead of a table row on phones. */
const FleetCard = (row) => {
  const vehicle = [row.make?.title, row.model?.title].filter(Boolean).join(" ");

  return (
    <Stack gap="sm">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <UnstyledButton
          component={Link}
          to={`/fleets/${row._id}`}
          style={{ minWidth: 0 }}
        >
          <Text size="sm" fw={600} tt="capitalize" truncate>
            {vehicle || "Unnamed vehicle"}
          </Text>

          <Group gap={6} mt={4}>
            <Badge size="sm" tt="uppercase">
              {row.licensePlate || "-"}
            </Badge>

            <Text size="xs" c="dimmed" tt="capitalize">
              {[row.year, row.color].filter(Boolean).join(" · ") || "-"}
            </Text>
          </Group>
        </UnstyledButton>

        <FleetTableRowMenu fleet={row} compact />
      </Group>

      <Group gap={6}>
        {row.status?.title && (
          <Badge size="sm" color={row.status.color} tt="capitalize">
            {row.status.title}
          </Badge>
        )}

        {row.condition?.title && (
          <Badge size="sm" color={row.condition.color} tt="capitalize">
            {row.condition.title}
          </Badge>
        )}

        {row.type?.title && (
          <Badge size="sm" color="gray" tt="capitalize">
            {row.type.title}
          </Badge>
        )}
      </Group>

      <Divider />

      <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
        <TwoLine
          top={formatAmount(row.purchaseAmount || 0)}
          bottom="Purchase"
        />
        <TwoLine top={row.rent ? formatAmount(row.rent) : "-"} bottom="Rent" />
        <TwoLine
          top={row.currentOdometer?.toLocaleString()}
          bottom="Odometer"
        />
        <TwoLine top={formatDate(row.createdAt)} bottom="Added" />
      </SimpleGrid>
    </Stack>
  );
};

const FleetTable = ({ query, hideColumns = [], toolbar }) => {
  const [globalFilters] = useLocalStorage({
    key: "globalFilters",
    getInitialValueInEffect: false,
  });
  const { filters, setFilters } = useFilters({});

  return (
    <PaginatedTable
      queryHook={useGetfleetsWithPaginationQuery}
      columns={DEFAULT_COLUMNS(filters, setFilters)}
      queryParams={{ ...globalFilters, ...filters, ...query }}
      hideColumns={hideColumns}
      mobileCard={FleetCard}
      toolbar={toolbar}
    />
  );
};

export default FleetTable;
