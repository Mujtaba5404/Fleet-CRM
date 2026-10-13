import {
  ActionIcon,
  Box,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowsExchange,
  IconChartBar,
  IconChartDonut,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
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

/**
 * Vehicles grouped two levels deep (e.g. fuel type → type): a column chart and
 * a donut of the second level. The groupings live in the URL, so a particular
 * view can be shared or bookmarked. `afterCharts` renders below the charts.
 */
const FleetGroupSummary = ({ afterCharts = null }) => {
  const vizColor = useVizColor();
  const { filters, setFilters } = useFilters();
  const [metric, setMetric] = useState("count");

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

        {afterCharts}
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

        {afterCharts}
      </Stack>
    );

  if (!primaryBuckets.length)
    return (
      <Stack gap="md">
        {controls}

        <Placeholder
          title="Nothing to group yet"
          description={`No vehicles carry a ${primaryLabel.toLowerCase()} value, so there is nothing to chart.`}
          icon={<IconChartBar size={32} />}
        />

        {afterCharts}
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

      {afterCharts}
    </Stack>
  );
};

export default FleetGroupSummary;
