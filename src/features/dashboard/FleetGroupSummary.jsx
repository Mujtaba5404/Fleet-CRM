import {
  ActionIcon,
  Badge,
  Box,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconArrowsExchange,
  IconArrowsSort,
  IconChartBar,
  IconChartDonut,
  IconChevronDown,
  IconChevronUp,
  IconTable,
  IconX,
} from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { useGetfleetSummaryByGroupQuery } from "../../api/fleet";
import ColumnChart, { ChartLegend } from "../../components/ColumnChart";
import DetailPanel from "../../components/DetailPanel";
import DonutChart from "../../components/DonutChart";
import Placeholder from "../../components/Placeholder";
import FLEET_GROUP_FIELDS, {
  DEFAULT_PRIMARY_GROUP,
  DEFAULT_SECONDARY_GROUP,
  groupFieldLabel,
} from "../../constants/FLEET_GROUP_FIELDS";
import useFilters from "../../hooks/useFilters";
import formatAmount, { formatAmountCompact } from "../../utils/formatAmount";
import formatNumber from "../../utils/formatNumber";
import useVizColor from "../../utils/useVizColor";
import { toStatusBucket } from "../fleets/fleetStatus";
import { withFallbackColors } from "../../utils/vizPalette";

// "Unassigned" would read as a vehicle status, so a missing value is "Not set".
const UNASSIGNED = "Not set";

/**
 * Status is an enum, so its summary buckets arrive as `{ _id: "assigned" }`
 * with no title or colour; give them the same label and colour as the badge.
 * Picklist buckets pass through untouched.
 */
const labelBuckets = (field) => (bucket) => {
  if (field !== "status") return bucket;

  const status = toStatusBucket(bucket._id ?? bucket.title);

  return status
    ? { ...bucket, title: status.title, color: status.color }
    : bucket;
};

const count = (bucket) => Number(bucket?.count) || 0;
const value = (bucket) => Number(bucket?.purchaseAmount) || 0;
const average = (bucket) => (count(bucket) ? value(bucket) / count(bucket) : 0);

/** Count and value are the two ways to weigh a bucket; both charts follow it. */
const METRICS = {
  count: {
    label: "Count",
    read: count,
    format: (amount) => formatNumber(amount, "standard"),
    axis: (amount) => formatNumber(amount, "compact"),
  },
  value: {
    label: "Value",
    read: value,
    format: formatAmount,
    axis: formatAmountCompact,
  },
};

/** A numeric column heading that sorts the table by its own figure. */
const SortableHeader = ({ active, direction, onClick, children }) => (
  <UnstyledButton onClick={onClick} w="100%">
    <Group gap={4} wrap="nowrap" justify="flex-end">
      {children}

      <Box
        c={active ? undefined : "dimmed"}
        opacity={active ? 1 : 0.4}
        style={{ display: "flex", flexShrink: 0 }}
      >
        {!active ? (
          <IconArrowsSort size={12} />
        ) : direction === "desc" ? (
          <IconChevronDown size={12} />
        ) : (
          <IconChevronUp size={12} />
        )}
      </Box>
    </Group>
  </UnstyledButton>
);

/**
 * Vehicles grouped two levels deep (e.g. fuel type → type): a column chart, a
 * donut of the second level, and the full table underneath. The groupings
 * live in the URL, so a particular view can be shared or bookmarked.
 */
const FleetGroupSummary = () => {
  const vizColor = useVizColor();
  const { filters, setFilters } = useFilters();
  const [metric, setMetric] = useState("count");
  const [sort, setSort] = useState({ key: "count", direction: "desc" });

  const primaryGroup = filters.primaryGroup || DEFAULT_PRIMARY_GROUP;
  const secondaryGroup = filters.secondaryGroup || DEFAULT_SECONDARY_GROUP;
  const primaryLabel = groupFieldLabel(primaryGroup);
  const secondaryLabel = groupFieldLabel(secondaryGroup);

  const { data, isLoading, isError, error } = useGetfleetSummaryByGroupQuery({
    primaryGroup,
    secondaryGroup,
  });

  const { read, format, axis } = METRICS[metric];

  const primaryBuckets = (data?.primaryGroupWise ?? []).map((bucket) => ({
    ...labelBuckets(primaryGroup)(bucket),
    secondaryGroupWise: (bucket.secondaryGroupWise ?? []).map(
      labelBuckets(secondaryGroup),
    ),
  }));
  const secondaryBuckets = (data?.secondaryGroupWise ?? []).map(
    labelBuckets(secondaryGroup),
  );

  const totalCount = Number(data?.totalCount) || 0;
  const totalValue = Number(data?.totalPurchaseAmount) || 0;
  const metricTotal = metric === "count" ? totalCount : totalValue;

  const toRow = (bucket) => ({
    key: bucket._id ?? "unassigned",
    label: bucket.title || UNASSIGNED,
    color: bucket.color,
    count: count(bucket),
    value: value(bucket),
    average: average(bucket),
  });

  const compare = (a, b) => {
    const delta = a[sort.key] - b[sort.key];

    if (delta !== 0) return sort.direction === "desc" ? -delta : delta;

    return a.label.localeCompare(b.label);
  };

  const rows = primaryBuckets
    .map((bucket) => ({
      ...toRow(bucket),
      children: bucket.secondaryGroupWise.map(toRow).sort(compare),
    }))
    .sort(compare);

  // One series per second-level value, so every column shares one legend.
  // Colours are assigned before sorting, so switching Count/Value re-orders
  // the legend without repainting any series.
  const series = withFallbackColors(
    secondaryBuckets.map((bucket) => ({
      key: bucket._id ?? "unassigned",
      label: bucket.title || UNASSIGNED,
      color: bucket.color,
      value: read(bucket),
    })),
  ).sort((a, b) => b.value - a.value);

  const chartGroups = primaryBuckets
    .map((bucket) => ({
      key: bucket._id ?? "unassigned",
      label: bucket.title || UNASSIGNED,
      total: read(bucket),
      values: Object.fromEntries(
        bucket.secondaryGroupWise.map((cell) => [
          cell._id ?? "unassigned",
          read(cell),
        ]),
      ),
    }))
    .sort((a, b) => b.total - a.total);

  const toggleSort = (key) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "desc" ? "asc" : "desc" }
        : { key, direction: "desc" },
    );

  // Grouping a field by itself tells you nothing, so block the overlap.
  const optionsFor = (excluded) =>
    FLEET_GROUP_FIELDS.map((field) => ({
      ...field,
      disabled: field.value === excluded,
    }));

  const controls = (
    <Paper p="sm">
      <Group gap="sm" align="flex-end" wrap="wrap">
        <Select
          label="Group by"
          data={optionsFor(secondaryGroup)}
          value={primaryGroup}
          onChange={(next) => next && setFilters({ primaryGroup: next })}
          searchable={false}
          w={{ base: "100%", xs: 190 }}
        />

        <Tooltip label="Swap groupings">
          <ActionIcon
            size="lg"
            variant="default"
            mb={2}
            onClick={() =>
              setFilters({
                primaryGroup: secondaryGroup,
                secondaryGroup: primaryGroup,
              })
            }
            aria-label="Swap groupings"
          >
            <IconArrowsExchange size={18} />
          </ActionIcon>
        </Tooltip>

        <Select
          label="Then by"
          data={optionsFor(primaryGroup)}
          value={secondaryGroup}
          onChange={(next) => next && setFilters({ secondaryGroup: next })}
          searchable={false}
          w={{ base: "100%", xs: 190 }}
        />

        <SegmentedControl
          value={metric}
          onChange={setMetric}
          data={Object.entries(METRICS).map(([key, { label }]) => ({
            value: key,
            label,
          }))}
          ml={{ base: 0, sm: "auto" }}
        />
      </Group>
    </Paper>
  );

  if (isError)
    return (
      <Stack gap="md">
        {controls}

        <Placeholder
          title={
            error?.response?.data?.message ||
            error?.message ||
            "Could not load the summary"
          }
          description="The grouping may not be supported for this field."
          icon={<IconX size={32} />}
        />
      </Stack>
    );

  if (isLoading)
    return (
      <Stack gap="md">
        {controls}

        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Skeleton height={340} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Skeleton height={340} radius="md" />
          </Grid.Col>
        </Grid>
      </Stack>
    );

  if (!rows.length)
    return (
      <Stack gap="md">
        {controls}

        <Placeholder
          title="Nothing to group yet"
          description={`No vehicles carry a ${primaryLabel.toLowerCase()} value, so there is nothing to chart.`}
          icon={<IconChartBar size={32} />}
        />
      </Stack>
    );

  return (
    <Stack gap="md">
      {controls}

      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <DetailPanel
            title={`${primaryLabel} by ${secondaryLabel.toLowerCase()}`}
            icon={IconChartBar}
            h="100%"
            action={<ChartLegend series={series} />}
          >
            <ColumnChart
              groups={chartGroups}
              series={series}
              valueFormatter={axis}
              height={260}
              minStep={metric === "count" ? 1 : 1000}
            />
          </DetailPanel>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <DetailPanel
            title={`Split by ${secondaryLabel.toLowerCase()}`}
            icon={IconChartDonut}
            h="100%"
          >
            <Stack gap="lg" align="center">
              <DonutChart
                data={series}
                size={180}
                centerValue={axis(metricTotal)}
                centerLabel={metric === "count" ? "vehicles" : "at purchase"}
                valueFormatter={format}
              />

              <Stack gap="xs" w="100%">
                {series.map((slice) => (
                  <Group key={slice.key} gap="xs" wrap="nowrap">
                    <Box
                      w={8}
                      h={8}
                      style={{
                        borderRadius: 999,
                        background: vizColor(slice.color),
                        flexShrink: 0,
                      }}
                    />

                    <Text fz="sm" tt="capitalize" truncate flex={1}>
                      {slice.label}
                    </Text>

                    <Text
                      fz="sm"
                      fw={600}
                      className="numeric"
                      style={{ flexShrink: 0 }}
                    >
                      {format(slice.value)}
                    </Text>

                    <Text
                      fz="xs"
                      c="dimmed"
                      w={38}
                      ta="right"
                      className="numeric"
                      style={{ flexShrink: 0 }}
                    >
                      {Math.round(
                        metricTotal ? (slice.value / metricTotal) * 100 : 0,
                      )}
                      %
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </DetailPanel>
        </Grid.Col>
      </Grid>

      <DetailPanel
        title={`${primaryLabel} × ${secondaryLabel}`}
        icon={IconTable}
        action={
          <Text fz="xs" c="dimmed">
            {rows.length} groups · {series.length}{" "}
            {secondaryLabel.toLowerCase()} values
          </Text>
        }
      >
        <Table.ScrollContainer minWidth={680}>
          <Table
            withRowBorders={false}
            highlightOnHover
            verticalSpacing="xs"
            horizontalSpacing="sm"
            className="numeric"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={220}>{primaryLabel}</Table.Th>

                <Table.Th w={110}>
                  <SortableHeader
                    active={sort.key === "count"}
                    direction={sort.direction}
                    onClick={() => toggleSort("count")}
                  >
                    Vehicles
                  </SortableHeader>
                </Table.Th>

                <Table.Th w={170} ta="right">
                  Share
                </Table.Th>

                <Table.Th w={160}>
                  <SortableHeader
                    active={sort.key === "value"}
                    direction={sort.direction}
                    onClick={() => toggleSort("value")}
                  >
                    Purchase value
                  </SortableHeader>
                </Table.Th>

                <Table.Th w={150}>
                  <SortableHeader
                    active={sort.key === "average"}
                    direction={sort.direction}
                    onClick={() => toggleSort("average")}
                  >
                    Average
                  </SortableHeader>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {rows.map((row, index) => (
                <Fragment key={row.key}>
                  {/* The rule sits on the group row, so each block reads as one unit. */}
                  <Table.Tr
                    style={
                      index
                        ? {
                            borderTop:
                              "1px solid var(--mantine-color-default-border)",
                          }
                        : undefined
                    }
                  >
                    <Table.Td>
                      <Badge
                        size="sm"
                        color={row.color || "gray"}
                        tt="capitalize"
                      >
                        {row.label}
                      </Badge>
                    </Table.Td>

                    <Table.Td ta="right" fw={650}>
                      {formatNumber(row.count, "standard")}
                    </Table.Td>

                    <Table.Td>
                      <Group gap={10} wrap="nowrap" justify="flex-end">
                        <Box
                          flex={1}
                          h={6}
                          miw={44}
                          maw={90}
                          style={{
                            background: "var(--viz-grid)",
                            borderRadius: 999,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            h="100%"
                            w={`${totalCount ? Math.max((row.count / totalCount) * 100, row.count > 0 ? 2 : 0) : 0}%`}
                            style={{
                              background: "var(--viz-fill)",
                              borderRadius: "0 4px 4px 0",
                            }}
                          />
                        </Box>

                        <Text fz="xs" c="dimmed" w={32} ta="right">
                          {Math.round(
                            totalCount ? (row.count / totalCount) * 100 : 0,
                          )}
                          %
                        </Text>
                      </Group>
                    </Table.Td>

                    <Table.Td ta="right" fw={650}>
                      {formatAmount(row.value)}
                    </Table.Td>

                    <Table.Td ta="right">{formatAmount(row.average)}</Table.Td>
                  </Table.Tr>

                  {row.children.map((child) => (
                    <Table.Tr key={`${row.key}-${child.key}`}>
                      <Table.Td pl={28}>
                        <Group gap={8} wrap="nowrap">
                          <Box
                            w={10}
                            h={1}
                            bg="var(--mantine-color-default-border)"
                            style={{ flexShrink: 0 }}
                          />

                          <Badge
                            variant="dot"
                            size="sm"
                            color={child.color || "gray"}
                            tt="capitalize"
                            fw={500}
                          >
                            {child.label}
                          </Badge>
                        </Group>
                      </Table.Td>

                      <Table.Td ta="right" c="dimmed">
                        {formatNumber(child.count, "standard")}
                      </Table.Td>

                      <Table.Td ta="right">
                        <Text fz="xs" c="dimmed" tt="capitalize">
                          {Math.round(
                            row.count ? (child.count / row.count) * 100 : 0,
                          )}
                          % of {row.label}
                        </Text>
                      </Table.Td>

                      <Table.Td ta="right" c="dimmed">
                        {formatAmount(child.value)}
                      </Table.Td>

                      <Table.Td ta="right" c="dimmed">
                        {formatAmount(child.average)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Fragment>
              ))}
            </Table.Tbody>

            <Table.Tfoot
              style={{
                borderTop: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Table.Tr>
                <Table.Th>Total</Table.Th>
                <Table.Th ta="right">
                  {formatNumber(totalCount, "standard")}
                </Table.Th>
                <Table.Th />
                <Table.Th ta="right">{formatAmount(totalValue)}</Table.Th>
                <Table.Th ta="right">
                  {formatAmount(totalCount ? totalValue / totalCount : 0)}
                </Table.Th>
              </Table.Tr>
            </Table.Tfoot>
          </Table>
        </Table.ScrollContainer>
      </DetailPanel>
    </Stack>
  );
};

export default FleetGroupSummary;
