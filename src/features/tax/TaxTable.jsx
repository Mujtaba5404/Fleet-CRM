import {
  Badge,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useGetInsuranceWithPaginationQuery } from "../../api/insurance";
import PaginatedTable from "../../components/PaginatedTable";
import useFilters from "../../hooks/useFilters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
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

const payable = (row) =>
  row.totalAmount ?? row.totalPremium ?? row.premium ?? 0;

// const picklistFilter = (field, filters, setFilters) => ({
//   filter: (
//     <PicklistsMultiSelect
//       queryObject={{ resource: "Insurance", field }}
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
    accessor: "policyNumber",
    title: "Policy",
    width: 160,
    sortable: true,
    filter: (
      <TextInput
        size="xs"
        placeholder="Search by policy no."
        value={filters.policyNumber || ""}
        onChange={(e) => setFilters({ policyNumber: e.target.value })}
      />
    ),
    filtering: filters.policyNumber,
    render: (row) => (
      <UnstyledButton component={Link} to={`/insurance/${row._id}`}>
        <Badge variant="light" tt="uppercase">
          {row.policyNumber || "-"}
        </Badge>

        <Text size="xs" c="dimmed" tt="capitalize" mt={2}>
          {title(row.type) || "-"}
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
    // ...picklistFilter("status", filters, setFilters),
    render: (row) => (
      <Badge variant="light" color={color(row.status)} tt="capitalize">
        {title(row.status) || "-"}
      </Badge>
    ),
  },
  {
    accessor: "provider",
    width: 150,
    // ...picklistFilter("provider", filters, setFilters),
    render: (row) => (
      <TwoLine
        top={title(row.provider)}
        bottom={
          title(row.broker) ? `Broker: ${title(row.broker)}` : "No broker"
        }
      />
    ),
  },
  {
    accessor: "startDate",
    title: "Cover period",
    width: 160,
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
                Expired
              </Badge>
            )}
          </Group>
        </Stack>
      );
    },
  },
  {
    accessor: "totalAmount",
    title: "Payable",
    width: 150,
    sortable: true,
    render: (row) => (
      <TwoLine
        top={formatAmount(payable(row))}
        bottom={[
          row.taxAmount ? `Tax ${formatAmount(row.taxAmount)}` : null,
          row.discountAmount ? `− ${formatAmount(row.discountAmount)}` : null,
        ]
          .filter(Boolean)
          .join(" · ")}
      />
    ),
  },
  {
    accessor: "deductible",
    width: 120,
    sortable: true,
    render: (row) =>
      row.deductible != null ? formatAmount(row.deductible) : "-",
  },
  {
    accessor: "coverages",
    title: "Coverage",
    width: 200,
    render: (row) => {
      if (row.coverages?.length)
        return (
          <Group gap={4}>
            {row.coverages.map((cover, index) => (
              <Tooltip
                key={index}
                label={`Limit ${formatAmount(cover.limit || 0)} · Premium ${formatAmount(cover.premium || 0)}`}
                withArrow
              >
                <Badge
                  variant="light"
                  color={color(cover.type)}
                  tt="capitalize"
                >
                  {title(cover.type) || formatAmount(cover.limit || 0)}
                </Badge>
              </Tooltip>
            ))}
          </Group>
        );

      // if (row.coverage) return <Text size="sm">{formatAmount(row.coverage)}</Text>;

      return (
        <Text size="sm" c="dimmed">
          -
        </Text>
      );
    },
  },
  {
    accessor: "cancellationDate",
    title: "Cancelled",
    width: 160,
    sortable: true,
    render: (row) =>
      row.cancellationDate ? (
        <TwoLine
          top={formatDate(row.cancellationDate)}
          bottom={row.cancellationReason}
        />
      ) : (
        <Text size="sm" c="dimmed">
          -
        </Text>
      ),
  },
  {
    accessor: "notes",
    width: 200,
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
    render: (row) => <TaxTableRowMenu insurance={row} compact />,
  },
];

const TaxTable = ({ query, hideColumns = [] }) => {
  const [globalFilters] = useLocalStorage({
    key: "globalFilters",
    getInitialValueInEffect: false,
  });
  const { filters, setFilters } = useFilters({});

  return (
    <PaginatedTable
      queryHook={useGetInsuranceWithPaginationQuery}
      columns={DEFAULT_COLUMNS(filters, setFilters)}
      queryParams={{ ...globalFilters, ...filters, ...query }}
      hideColumns={hideColumns}
    />
  );
};

export default TaxTable;
