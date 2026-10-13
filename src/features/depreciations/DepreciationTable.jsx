import {
  Badge,
  Divider,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useGetDepreciationsWithPaginationQuery } from "../../api/depreciation";
import PaginatedTable from "../../components/PaginatedTable";
import useFilters from "../../hooks/useFilters";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import DepreciationMethodBadge from "./DepreciationMethodBadge";
import { buildMonthlySchedule, currentBookValue } from "./depreciationSchedule";
import DepreciationTableRowMenu from "./DepreciationTableRowMenu";

const TwoLine = ({ top, bottom }) => (
  <Stack gap={0}>
    <Text size="sm">{top || "-"}</Text>
    <Text size="xs" c="dimmed">
      {bottom || "-"}
    </Text>
  </Stack>
);

const formatLife = (months) =>
  months ? `${months} ${months === 1 ? "month" : "months"}` : "-";

const formatRate = (rate) =>
  rate === null || rate === undefined || rate === "" ? "-" : `${rate}%`;

/** Today's estimated book value and how much of the depreciable amount is gone. */
const bookValueOf = (row) => {
  const cost = Number(row.acquisitionCost) || 0;
  const depreciable = cost - (Number(row.salvageValue) || 0);
  const value = currentBookValue(row, buildMonthlySchedule(row));

  return {
    value,
    share:
      depreciable > 0 ? Math.min(((cost - value) / depreciable) * 100, 100) : 0,
  };
};

const Vehicle = ({ fleet }) =>
  fleet ? (
    <UnstyledButton component={Link} to={`/fleets/${fleet._id}`}>
      <Badge variant="light" color="gray" tt="uppercase">
        {fleet.licensePlate || "-"}
      </Badge>

      <Text size="xs" c="dimmed" tt="capitalize" mt={2}>
        {[fleet.year, fleet.color].filter(Boolean).join(" · ") || "-"}
      </Text>
    </UnstyledButton>
  ) : (
    <Text size="sm" c="dimmed">
      -
    </Text>
  );

const BookValue = ({ row }) => {
  const { value, share } = bookValueOf(row);

  return (
    <Stack gap={4}>
      <Group justify="space-between" gap="xs" wrap="nowrap">
        <Text size="sm" fw={600} className="numeric">
          {formatAmount(value)}
        </Text>
        <Text size="xs" c="dimmed" className="numeric">
          {Math.round(share)}%
        </Text>
      </Group>

      <Progress value={share} size="sm" radius="xl" />
    </Stack>
  );
};

const DEFAULT_COLUMNS = [
  {
    accessor: "fleet",
    title: "Vehicle",
    width: 160,
    render: (row) => <Vehicle fleet={row.fleet} />,
  },
  {
    accessor: "method",
    width: 160,
    sortable: true,
    render: (row) => (
      <UnstyledButton component={Link} to={`/depreciations/${row._id}`}>
        <DepreciationMethodBadge method={row.method} />
      </UnstyledButton>
    ),
  },
  {
    accessor: "acquisitionCost",
    title: "Cost",
    width: 140,
    sortable: true,
    render: (row) => formatAmount(row.acquisitionCost || 0),
  },
  {
    accessor: "salvageValue",
    title: "Salvage",
    width: 130,
    sortable: true,
    render: (row) => formatAmount(row.salvageValue || 0),
  },
  {
    accessor: "bookValue",
    title: "Book value today",
    width: 180,
    render: (row) => <BookValue row={row} />,
  },
  {
    accessor: "usefulLifeMonths",
    title: "Useful life",
    width: 120,
    textAlign: "center",
    sortable: true,
    render: (row) => formatLife(row.usefulLifeMonths),
  },
  {
    accessor: "depreciationRate",
    title: "Rate",
    width: 90,
    textAlign: "center",
    sortable: true,
    render: (row) => formatRate(row.depreciationRate),
  },
  {
    accessor: "startDate",
    title: "Starts",
    width: 120,
    textAlign: "center",
    sortable: true,
    render: (row) => (row.startDate ? formatDate(row.startDate) : "-"),
  },
  {
    accessor: "menu",
    width: 60,
    textAlign: "center",
    render: (row) => <DepreciationTableRowMenu depreciation={row} />,
  },
];

/** Compact card shown instead of a table row on phones. */
const DepreciationCard = (row) => (
  <Stack gap="sm">
    <Group justify="space-between" wrap="nowrap" align="flex-start">
      <UnstyledButton
        component={Link}
        to={`/depreciations/${row._id}`}
        style={{ minWidth: 0 }}
      >
        <Text size="sm" fw={600} tt="uppercase" truncate>
          {row.fleet?.licensePlate || "No vehicle"}
        </Text>

        <Group gap={6} mt={4}>
          <DepreciationMethodBadge method={row.method} />
        </Group>
      </UnstyledButton>

      <DepreciationTableRowMenu depreciation={row} />
    </Group>

    <BookValue row={row} />

    <Divider />

    <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
      <TwoLine top={formatAmount(row.acquisitionCost || 0)} bottom="Cost" />
      <TwoLine top={formatAmount(row.salvageValue || 0)} bottom="Salvage" />
      <TwoLine
        top={formatLife(row.usefulLifeMonths)}
        bottom={`Rate ${formatRate(row.depreciationRate)}`}
      />
      <TwoLine
        top={row.startDate ? formatDate(row.startDate) : "-"}
        bottom="Starts"
      />
    </SimpleGrid>
  </Stack>
);

/**
 * `queryHook` swaps the data source (e.g. one vehicle's depreciations on its
 * detail screen) while keeping the same columns and row menu.
 */
const DepreciationTable = ({
  query,
  hideColumns = [],
  toolbar,
  queryHook = useGetDepreciationsWithPaginationQuery,
}) => {
  const { filters } = useFilters({});

  return (
    <PaginatedTable
      queryHook={queryHook}
      columns={DEFAULT_COLUMNS}
      queryParams={{ ...filters, ...query }}
      hideColumns={hideColumns}
      mobileCard={DepreciationCard}
      toolbar={toolbar}
    />
  );
};

export default DepreciationTable;
