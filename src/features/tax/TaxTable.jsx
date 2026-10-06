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
import { useGetTaxWithPaginationQuery } from "../../api/tax";
import PaginatedTable from "../../components/PaginatedTable";
import useFilters from "../../hooks/useFilters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import PicklistsMultiSelect from "../picklists/components/PicklistsMultiSelect";
import TaxTableRowMenu from "./TaxTableRowMenu";

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

const title = (value) =>
  typeof value === "object" && value?.title ? value.title : null;
const color = (value) => (typeof value === "object" ? value?.color : undefined);

const picklistFilter = (field, filters, setFilters) => ({
  filter: (
    <PicklistsMultiSelect
      queryObject={{ resource: "Tax", field }}
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
    width: 110,
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
    accessor: "challanNumber",
    title: "Challan",
    width: 170,
    sortable: true,
    filter: (
      <TextInput
        size="xs"
        placeholder="Search by challan no."
        value={filters.challanNumber || ""}
        onChange={(e) => setFilters({ challanNumber: e.target.value })}
      />
    ),
    filtering: filters.challanNumber,
    render: (row) => (
      <UnstyledButton component={Link} to={`/tax/${row._id}`}>
        <Badge variant="light" tt="uppercase">
          {row.challanNumber || "-"}
        </Badge>

        <Text size="xs" c="dimmed" tt="capitalize" mt={2}>
          {title(row.jurisdiction) || "-"}
        </Text>
      </UnstyledButton>
    ),
  },
  {
    accessor: "fleet",
    title: "Vehicle",
    width: 160,
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
          <Badge variant="light" color="gray" tt="uppercase">
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
    accessor: "status",
    width: 120,
    textAlign: "center",
    ...picklistFilter("status", filters, setFilters),
    render: (row) => (
      <Badge variant="light" color={color(row.status)} tt="capitalize">
        {title(row.status) || "-"}
      </Badge>
    ),
  },
  {
    accessor: "jurisdiction",
    width: 140,
    textAlign: "center",
    ...picklistFilter("jurisdiction", filters, setFilters),
    render: (row) => (
      <Badge variant="light" color={color(row.jurisdiction)} tt="capitalize">
        {title(row.jurisdiction) || "-"}
      </Badge>
    ),
  },
  {
    accessor: "startDate",
    title: "Tax period",
    width: 170,
    sortable: true,
    render: (row) => {
      const expired = row.endDate && new Date(row.endDate) < new Date();

      return (
        <Stack gap={0}>
          <Text size="sm">
            {row.startDate ? formatDate(row.startDate) : "-"}
          </Text>

          <Group gap={6}>
            <Text size="xs" c="dimmed">
              {row.endDate ? formatDate(row.endDate) : "Open"}
            </Text>

            {expired && (
              <Badge size="xs" variant="light" color="red">
                Lapsed
              </Badge>
            )}
          </Group>
        </Stack>
      );
    },
  },
  {
    accessor: "filingDate",
    title: "Filed",
    width: 130,
    textAlign: "center",
    sortable: true,
    render: (row) =>
      row.filingDate ? (
        formatDate(row.filingDate)
      ) : (
        <Badge size="xs" variant="light" color="orange">
          Not filed
        </Badge>
      ),
  },
  {
    accessor: "taxAmount",
    title: "Amount",
    width: 130,
    sortable: true,
    render: (row) =>
      row.taxAmount != null ? formatAmount(row.taxAmount) : "-",
  },
  {
    accessor: "menu",
    width: 60,
    textAlign: "center",
    render: (row) => <TaxTableRowMenu tax={row} compact />,
  },
];

/** Compact card shown instead of a table row on phones. */
const TaxCard = (row) => {
  const lapsed = row.endDate && new Date(row.endDate) < new Date();

  return (
    <Stack gap="sm">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <UnstyledButton
          component={Link}
          to={`/tax/${row._id}`}
          style={{ minWidth: 0 }}
        >
          <Text size="sm" fw={600} tt="uppercase" truncate>
            {row.challanNumber || "No challan number"}
          </Text>

          <Group gap={6} mt={4}>
            {row.fleet?.licensePlate && (
              <Badge size="sm" color="gray" tt="uppercase">
                {row.fleet.licensePlate}
              </Badge>
            )}

            <Text size="xs" c="dimmed" tt="capitalize">
              {title(row.jurisdiction) || "No jurisdiction"}
            </Text>
          </Group>
        </UnstyledButton>

        <TaxTableRowMenu tax={row} compact />
      </Group>

      <Group gap={6}>
        {title(row.status) && (
          <Badge size="sm" color={color(row.status)} tt="capitalize">
            {title(row.status)}
          </Badge>
        )}

        {!row.filingDate && (
          <Badge size="sm" color="orange">
            Not filed
          </Badge>
        )}

        {lapsed && (
          <Badge size="sm" color="red">
            Lapsed
          </Badge>
        )}
      </Group>

      <Divider />

      <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
        <TwoLine
          top={row.taxAmount != null ? formatAmount(row.taxAmount) : "-"}
          bottom="Amount"
        />
        <TwoLine
          top={row.filingDate ? formatDate(row.filingDate) : "-"}
          bottom="Filed"
        />
        <TwoLine
          top={row.startDate ? formatDate(row.startDate) : "-"}
          bottom="Period from"
        />
        <TwoLine
          top={row.endDate ? formatDate(row.endDate) : "Open"}
          bottom="Period to"
        />
      </SimpleGrid>
    </Stack>
  );
};

const TaxTable = ({ query, hideColumns = [], toolbar }) => {
  const [globalFilters] = useLocalStorage({
    key: "globalFilters",
    getInitialValueInEffect: false,
  });
  const { filters, setFilters } = useFilters({});

  return (
    <PaginatedTable
      queryHook={useGetTaxWithPaginationQuery}
      columns={DEFAULT_COLUMNS(filters, setFilters)}
      queryParams={{ ...globalFilters, ...filters, ...query }}
      hideColumns={hideColumns}
      mobileCard={TaxCard}
      toolbar={toolbar}
    />
  );
};

export default TaxTable;
