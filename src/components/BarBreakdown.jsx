import { Box, Group, Progress, Stack, Text, Tooltip } from "@mantine/core";
import { withFallbackColors } from "../utils/vizPalette";

const BAR_HEIGHT = 16;

// A segment narrower than this cannot fit its share, so it relies on the
// tooltip and the legend.
const MIN_LABEL_SHARE = 12;

/**
 * Part-to-whole breakdown as one segmented progress bar, with a legend that
 * repeats every name, value and share as text, so small segments and colour
 * alone never carry the information.
 *
 * A row that carries its own colour (a picklist's configured colour) keeps it;
 * otherwise it takes the next fallback hue. "Other" and "Unassigned" are gray.
 *
 * @param {Object}   props
 * @param {Array<{key, label, value, color?}>} props.data
 * @param {Function} [props.valueFormatter]
 * @param {string}   [props.emptyMessage]
 */
const BarBreakdown = ({
  data = [],
  emptyMessage = "No data yet",
  valueFormatter = (value) => value,
}) => {
  if (!data.length) {
    return (
      <Text fz="sm" c="dimmed" py="lg" ta="center">
        {emptyMessage}
      </Text>
    );
  }

  const total = data.reduce((sum, row) => sum + (Number(row.value) || 0), 0);

  const rows = withFallbackColors(data).map((row) => {
    const value = Number(row.value) || 0;

    return { ...row, value, share: total ? (value / total) * 100 : 0 };
  });

  return (
    <Stack gap="md">
      {/* 2px gaps let the track show between segments, so neighbours of
          similar hue still read as separate parts. */}
      <Progress.Root size={BAR_HEIGHT} radius="xl" style={{ gap: 2 }}>
        {rows.map((row) => (
          <Tooltip
            key={row.key ?? row.label}
            label={`${row.label} · ${valueFormatter(row.value)} · ${Math.round(row.share)}%`}
            tt="capitalize"
            position="top"
          >
            <Progress.Section value={row.share} color={row.color}>
              {row.share >= MIN_LABEL_SHARE && (
                <Progress.Label>{Math.round(row.share)}%</Progress.Label>
              )}
            </Progress.Section>
          </Tooltip>
        ))}
      </Progress.Root>

      <Stack gap={6}>
        {rows.map((row) => (
          <Group key={row.key ?? row.label} gap="xs" wrap="nowrap">
            <Box
              w={8}
              h={8}
              style={{
                borderRadius: 999,
                background: `var(--mantine-color-${row.color}-filled)`,
                flexShrink: 0,
              }}
            />

            <Text fz="sm" tt="capitalize" truncate flex={1}>
              {row.label}
            </Text>

            <Text
              fz="sm"
              fw={600}
              className="numeric"
              style={{ flexShrink: 0 }}
            >
              {valueFormatter(row.value)}
            </Text>

            <Text
              fz="xs"
              c="dimmed"
              w={38}
              ta="right"
              className="numeric"
              style={{ flexShrink: 0 }}
            >
              {Math.round(row.share)}%
            </Text>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
};

export default BarBreakdown;
