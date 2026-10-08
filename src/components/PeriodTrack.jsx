import { Badge, Group, Progress, Stack, Text } from "@mantine/core";
import { useState } from "react";
import formatDate from "../utils/formatDate";
import classes from "./PeriodTrack.module.css";

const clamp = (value) => Math.min(100, Math.max(0, value));

/**
 * A date range drawn as a bar: how much of it has passed, where today falls,
 * and an optional milestone (e.g. the filing date) pinned under the bar.
 *
 * @param {Object} props
 * @param {string|Date} props.start
 * @param {string|Date} props.end
 * @param {{label: string, date: string|Date, color?: string}} [props.marker]
 * @param {ReactNode} [props.caption]  Centred between the start and end dates.
 */
const PeriodTrack = ({ start, end, marker, caption }) => {
  const from = new Date(start).getTime();
  const to = new Date(end).getTime();
  const span = to - from;

  const at = (date) =>
    span > 0 ? clamp(((new Date(date).getTime() - from) / span) * 100) : 100;

  // Read once on mount so re-renders do not nudge the bar.
  const [now] = useState(() => Date.now());
  const elapsed = at(now);
  const showToday = now > from && now < to;
  const markerAt = marker?.date ? at(marker.date) : null;

  return (
    <Stack gap="xs">
      <div
        className={classes.track}
        data-with-below={marker ? true : undefined}
      >
        <div className={classes.bar}>
          <Progress
            value={elapsed}
            size={10}
            radius="xl"
            color={now >= to ? "gray" : "brand"}
            aria-label={`${Math.round(elapsed)}% of the period elapsed`}
          />
        </div>

        {showToday && (
          <>
            <span className={classes.tick} style={{ "--at": `${elapsed}%` }} />

            <Text
              fz="xs"
              fw={600}
              className={classes.label}
              data-place="above"
              style={{ "--at": `${elapsed}%` }}
            >
              Today
            </Text>
          </>
        )}

        {markerAt != null && (
          <>
            <span
              className={classes.tick}
              style={{
                "--at": `${markerAt}%`,
                "--tick": `var(--mantine-color-${marker.color || "teal"}-filled)`,
              }}
            />

            <Badge
              size="sm"
              color={marker.color || "teal"}
              className={classes.label}
              data-place="below"
              style={{ "--at": `${markerAt}%` }}
            >
              {marker.label} · {formatDate(marker.date)}
            </Badge>
          </>
        )}
      </div>

      <Group justify="space-between" align="flex-end" wrap="nowrap" gap="sm">
        <Stack gap={0}>
          <Text fz="xs" c="dimmed">
            Starts
          </Text>
          <Text fz="sm" fw={600} className="numeric">
            {formatDate(start)}
          </Text>
        </Stack>

        {caption && (
          <Text fz="xs" c="dimmed" ta="center" visibleFrom="xs">
            {caption}
          </Text>
        )}

        <Stack gap={0} align="flex-end">
          <Text fz="xs" c="dimmed">
            Ends
          </Text>
          <Text fz="sm" fw={600} className="numeric">
            {formatDate(end)}
          </Text>
        </Stack>
      </Group>
    </Stack>
  );
};

export default PeriodTrack;
