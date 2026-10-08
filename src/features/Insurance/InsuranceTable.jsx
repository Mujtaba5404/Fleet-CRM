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
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useLocalStorage } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { useGetInsuranceWithPaginationQuery } from "../../api/insurance";
import NoteHoverCell from "../../components/NoteHoverCell";
import PaginatedTable from "../../components/PaginatedTable";
import useFilters from "../../hooks/useFilters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import PicklistsMultiSelect from "../picklists/components/PicklistsMultiSelect";
import { INSURANCE_STATUS_OPTIONS } from "./insuranceStatus";
import InsuranceStatusBadge from "./InsuranceStatusBadge";
import InsuranceTableRowMenu from "./InsuranceTableRowMenu";

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

const picklistFilter = (field, filters, setFilters) => ({
  filter: (
    <PicklistsMultiSelect
      queryObject={{ resource: "Insurance", field }}
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
    width: 150,
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
    width: 130,
    textAlign: "center",
    filter: (
      <MultiSelect
        size="xs"
        placeholder="Select status"
        data={INSURANCE_STATUS_OPTIONS.map(({ value, label }) => ({
          value,
          label,
        }))}
        value={filters.status || []}
        onChange={(value) => setFilters({ status: value })}
        comboboxProps={{ withinPortal: false }}
      />
    ),
    filtering: filters.status?.length,
    render: (row) => <InsuranceStatusBadge insurance={row} />,
  },
  {
    accessor: "provider",
    width: 150,
    ...picklistFilter("provider", filters, setFilters),
    render: (row) =>
      title(row.provider) ? (
        <Badge variant="light" color={color(row.provider)} tt="capitalize">
          {title(row.provider)}
        </Badge>
      ) : (
        <Text size="sm" c="dimmed">
          -
        </Text>
      ),
  },
  {
    accessor: "startDate",
    title: "Cover period",
    width: 160,
    sortable: true,
    render: (row) => (
      <TwoLine
        top={row.startDate ? formatDate(row.startDate) : "-"}
        bottom={row.endDate ? formatDate(row.endDate) : "Open"}
      />
    ),
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
    accessor: "coverage",
    title: "Coverage",
    width: 160,
    sortable: true,
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

      if (row.coverage != null)
        return (
          <Text size="sm" className="numeric">
            {formatAmount(row.coverage)}
          </Text>
        );

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
    render: (row) => <InsuranceTableRowMenu insurance={row} compact />,
  },
];

/** Compact card shown instead of a table row on phones. */
const InsuranceCard = (row) => {
  return (
    <Stack gap="sm">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <UnstyledButton
          component={Link}
          to={`/insurance/${row._id}`}
          style={{ minWidth: 0 }}
        >
          <Text size="sm" fw={600} tt="uppercase" truncate>
            {row.policyNumber || "No policy number"}
          </Text>

          <Group gap={6} mt={4}>
            {row.fleet?.licensePlate && (
              <Badge size="sm" color="gray" tt="uppercase">
                {row.fleet.licensePlate}
              </Badge>
            )}

            <Text size="xs" c="dimmed" tt="capitalize">
              {title(row.provider) || "No provider"}
            </Text>
          </Group>
        </UnstyledButton>

        <InsuranceTableRowMenu insurance={row} compact />
      </Group>

      <Group gap={6}>
        <InsuranceStatusBadge insurance={row} />

        {title(row.type) && (
          <Badge size="sm" color="gray" tt="capitalize">
            {title(row.type)}
          </Badge>
        )}
      </Group>

      <Divider />

      <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
        <TwoLine top={formatAmount(payable(row))} bottom="Payable" />
        <TwoLine
          top={row.coverage != null ? formatAmount(row.coverage) : "-"}
          bottom="Coverage"
        />
        <TwoLine
          top={row.startDate ? formatDate(row.startDate) : "-"}
          bottom="Cover from"
        />
        <TwoLine
          top={row.endDate ? formatDate(row.endDate) : "Open"}
          bottom="Cover to"
        />
      </SimpleGrid>
    </Stack>
  );
};

/**
 * `queryHook` swaps the data source (e.g. one vehicle's policies on its
 * detail screen) while keeping the same columns, filters and row menu.
 */
const InsuranceTable = ({
  query,
  hideColumns = [],
  toolbar,
  queryHook = useGetInsuranceWithPaginationQuery,
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
      mobileCard={InsuranceCard}
      toolbar={toolbar}
    />
  );
};

export default InsuranceTable;
