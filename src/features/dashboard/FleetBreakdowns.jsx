import { Grid, Skeleton } from "@mantine/core";
import {
  IconCar,
  IconGasStation,
  IconProgressCheck,
  IconSparkles,
} from "@tabler/icons-react";
import BarBreakdown from "../../components/BarBreakdown";
import DetailPanel from "../../components/DetailPanel";
import { toStatusBucket } from "../fleets/fleetStatus";

// Matches BarBreakdown's fallback palette, so even uncoloured values never
// repeat a hue; the tail folds into a gray "Other".
const MAX_BREAKDOWN_ROWS = 6;

/** Vehicles per picklist value (or status), biggest first. */
const breakdownBy = (fleets, field, resolve = (value) => value) => {
  const buckets = new Map();

  fleets.forEach((fleet) => {
    const item = resolve(fleet[field]);
    const key = item?._id || "unassigned";
    const existing = buckets.get(key);

    if (existing) {
      existing.value += 1;
      return;
    }

    buckets.set(key, {
      key,
      label: item?.title || "Not set",
      color: item?.color,
      value: 1,
    });
  });

  const rows = [...buckets.values()].sort((a, b) => b.value - a.value);

  if (rows.length <= MAX_BREAKDOWN_ROWS) return rows;

  const tail = rows.slice(MAX_BREAKDOWN_ROWS - 1);

  return [
    ...rows.slice(0, MAX_BREAKDOWN_ROWS - 1),
    {
      key: "other",
      label: `Other (${tail.length})`,
      value: tail.reduce((sum, row) => sum + row.value, 0),
    },
  ];
};

const BREAKDOWNS = [
  {
    field: "status",
    title: "Vehicles by status",
    icon: IconProgressCheck,
    // An enum, not a picklist: give it a label and colour.
    resolve: toStatusBucket,
  },
  { field: "type", title: "Vehicles by type", icon: IconCar },
  { field: "fuelType", title: "Vehicles by fuel type", icon: IconGasStation },
  { field: "condition", title: "Vehicles by condition", icon: IconSparkles },
];

/** Four part-to-whole bars over the whole fleet. */
const FleetBreakdowns = ({ fleets = [], isLoading = false }) => (
  <Grid gutter="md">
    {BREAKDOWNS.map(({ field, title, icon, resolve }) => (
      <Grid.Col key={field} span={{ base: 12, lg: 6 }}>
        {isLoading ? (
          <Skeleton height={150} radius="md" />
        ) : (
          <DetailPanel title={title} icon={icon} h="100%">
            <BarBreakdown
              data={breakdownBy(fleets, field, resolve)}
              emptyMessage="No vehicles yet"
            />
          </DetailPanel>
        )}
      </Grid.Col>
    ))}
  </Grid>
);

export default FleetBreakdowns;
