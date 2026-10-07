import { Box, Group, Stack, Text, Tooltip } from "@mantine/core";
import useVizColor from "../utils/useVizColor";

const AXIS_WIDTH = 64;
const TICKS = 4;
const MIN_BAR = 3;

/**
 * A tick step a reader can divide in their head (1, 2, 2.5 or 5 times a power
 * of ten), so the axis lands on round numbers rather than on the data's peak.
 * `minStep` keeps a count axis on whole vehicles instead of halves.
 */
const niceStep = (peak, minStep) => {
  const raw = peak / TICKS;
  const magnitude = 10 ** Math.floor(Math.log10(raw || 1));
  const candidates = [1, 2, 2.5, 5, 7.5, 10]
    .map((multiple) => multiple * magnitude)
    .filter((step) => step >= minStep);
  const step =
    candidates.find((candidate) => candidate >= raw) ??
    Math.max(minStep, 10 * magnitude);

  return minStep >= 1 ? Math.ceil(step) : step;
};

/** Colour dots and names for the series in a chart; sits in the card header. */
export const ChartLegend = ({ series = [] }) => {
  const vizColor = useVizColor();

  return (
    <Group gap="md" wrap="wrap">
      {series.map((item) => (
        <Group key={item.key} gap={6} wrap="nowrap">
          <Box
            w={8}
            h={8}
            style={{
              borderRadius: 999,
              background: vizColor(item.color),
              flexShrink: 0,
            }}
          />

          <Text fz="xs" c="dimmed" tt="capitalize">
            {item.label}
          </Text>
        </Group>
      ))}
    </Group>
  );
};

/**
 * Vertical column chart comparing named groups, each split into series.
 *
 * Grouped by default; once there are more series than the eye can pair up it
 * stacks instead, where the question becomes composition. The scale is drawn
 * (labelled ticks and gridlines) so a column reads against a number, and every
 * column has a hover tooltip with its exact value.
 *
 * @param {Object} props
 * @param {Array<{key, label, values: Object}>} props.groups
 * @param {Array<{key, label, color?}>} props.series
 */
const ColumnChart = ({
  groups = [],
  series = [],
  height = 240,
  stacked,
  minStep = 1,
  valueFormatter = (value) => value,
  emptyMessage = "No data yet",
}) => {
  const vizColor = useVizColor();

  if (!groups.length || !series.length) {
    return (
      <Text fz="sm" c="dimmed" py="xl" ta="center">
        {emptyMessage}
      </Text>
    );
  }

  const isStacked = stacked ?? series.length > 4;

  const valueOf = (group, key) => Number(group.values?.[key]) || 0;
  const totalOf = (group) =>
    series.reduce((sum, item) => sum + valueOf(group, item.key), 0);

  const peak = isStacked
    ? Math.max(...groups.map(totalOf))
    : Math.max(
        ...groups.flatMap((group) =>
          series.map((item) => valueOf(group, item.key)),
        ),
      );

  const step = niceStep(peak, minStep);
  const max = step * TICKS;
  const ticks = Array.from(
    { length: TICKS + 1 },
    (_, index) => step * (TICKS - index),
  );

  return (
    <Box>
      <Box pos="relative" h={height} style={{ paddingLeft: AXIS_WIDTH }}>
        {/* Scale: one labelled gridline per tick, the baseline solid. */}
        {ticks.map((tick, index) => (
          <Box
            key={tick}
            pos="absolute"
            left={0}
            right={0}
            top={`${(index / TICKS) * 100}%`}
            style={{ pointerEvents: "none" }}
          >
            <Text
              fz={10}
              c="dimmed"
              pos="absolute"
              left={0}
              w={AXIS_WIDTH - 10}
              ta="right"
              className="numeric"
              style={{ transform: "translateY(-50%)" }}
            >
              {valueFormatter(tick)}
            </Text>

            <Box
              ml={AXIS_WIDTH}
              style={{
                borderTop:
                  index === TICKS
                    ? "1px solid var(--viz-axis)"
                    : "1px dashed var(--viz-grid)",
              }}
            />
          </Box>
        ))}

        <Group
          h="100%"
          gap="lg"
          align="flex-end"
          justify="space-around"
          wrap="nowrap"
          style={{ position: "relative" }}
        >
          {groups.map((group) => (
            <Box
              key={group.key}
              h="100%"
              flex={1}
              miw={0}
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              {isStacked ? (
                <Stack
                  gap={2}
                  w="100%"
                  maw={72}
                  mx="auto"
                  justify="flex-end"
                  h="100%"
                >
                  {series.map((item) => {
                    const amount = valueOf(group, item.key);

                    if (!amount) return null;

                    return (
                      <Tooltip
                        key={item.key}
                        label={`${group.label} · ${item.label} · ${valueFormatter(amount)}`}
                        tt="capitalize"
                        position="top"
                      >
                        <Box
                          h={`${Math.max((amount / max) * 100, MIN_BAR)}%`}
                          style={{
                            background: vizColor(item.color),
                            borderRadius: 4,
                            cursor: "default",
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Stack>
              ) : (
                <Group
                  gap={2}
                  align="flex-end"
                  justify="center"
                  wrap="nowrap"
                  w="100%"
                  h="100%"
                >
                  {series.map((item) => {
                    const amount = valueOf(group, item.key);

                    return (
                      <Tooltip
                        key={item.key}
                        label={`${group.label} · ${item.label} · ${valueFormatter(amount)}`}
                        tt="capitalize"
                        position="top"
                      >
                        <Box
                          flex={1}
                          maw={34}
                          h={`${amount ? Math.max((amount / max) * 100, MIN_BAR) : 0}%`}
                          style={{
                            background: vizColor(item.color),
                            borderRadius: "4px 4px 0 0",
                            cursor: "default",
                            transition:
                              "height 320ms cubic-bezier(0.32, 0.72, 0, 1)",
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Group>
              )}
            </Box>
          ))}
        </Group>
      </Box>

      {/* Category labels sit outside the plot so they never overlap a short column. */}
      <Group
        gap="lg"
        justify="space-around"
        wrap="nowrap"
        mt={8}
        style={{ paddingLeft: AXIS_WIDTH }}
      >
        {groups.map((group) => (
          <Text
            key={group.key}
            fz="xs"
            c="dimmed"
            fw={500}
            tt="capitalize"
            ta="center"
            flex={1}
            miw={0}
            truncate
          >
            {group.label}
          </Text>
        ))}
      </Group>
    </Box>
  );
};

export default ColumnChart;
