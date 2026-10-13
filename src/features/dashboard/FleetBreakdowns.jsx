import { useMemo, useState } from "react";
import { Select, Skeleton } from "@mantine/core";
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
    label: "Status",
    title: "Vehicles by status",
    icon: IconProgressCheck,
    // An enum, not a picklist: give it a label and colour.
    resolve: toStatusBucket,
  },
  { field: "type", label: "Type", title: "Vehicles by type", icon: IconCar },
  {
    field: "fuelType",
    label: "Fuel type",
    title: "Vehicles by fuel type",
    icon: IconGasStation,
  },
  {
    field: "condition",
    label: "Condition",
    title: "Vehicles by condition",
    icon: IconSparkles,
  },
];

/** One part-to-whole bar over the whole fleet, split by the picked field. */
const FleetBreakdowns = ({ fleets = [], isLoading = false }) => {
  const [field, setField] = useState(BREAKDOWNS[0].field);
  const { title, icon, resolve } =
    BREAKDOWNS.find((breakdown) => breakdown.field === field) || BREAKDOWNS[0];

  const data = useMemo(
    () => breakdownBy(fleets, field, resolve),
    [fleets, field, resolve],
  );

  if (isLoading) return <Skeleton height={150} radius="md" />;

  return (
    <DetailPanel
      title={title}
      icon={icon}
      action={
        <Select
          size="xs"
          w={150}
          value={field}
          onChange={(value) => value && setField(value)}
          allowDeselect={false}
          searchable={false}
          aria-label="Split vehicles by"
          data={BREAKDOWNS.map(({ field, label }) => ({ value: field, label }))}
        />
      }
    >
      <BarBreakdown
        data={data}
        emptyMessage="No vehicles yet"
        showLegend={false}
      />
    </DetailPanel>
  );
};

export default FleetBreakdowns;
