import { Group, Paper, Stack, Text } from "@mantine/core";
import classes from "./DetailHero.module.css";

/**
 * The summary strip at the top of a detail screen.
 *
 * @param {Object} props
 * @param {ReactNode} props.title      Usually the record's identifier.
 * @param {ReactNode} [props.badges]   Status, priority, warnings…
 * @param {ReactNode} [props.subtitle] e.g. the linked vehicle.
 * @param {string} [props.figureLabel] Caption above the headline number.
 * @param {string} [props.figure]      The headline number.
 * @param {string} [props.figureHint]
 * @param {string} [props.railColor]   Mantine colour key driving the edge rail.
 */
const DetailHero = ({
  title,
  badges,
  subtitle,
  figureLabel,
  figure,
  figureHint,
  railColor,
}) => (
  <Paper
    className={classes.hero}
    style={
      railColor
        ? { "--rail": `var(--mantine-color-${railColor}-filled)` }
        : undefined
    }
  >
    <Group
      className={classes.heroInner}
      justify="space-between"
      align="flex-start"
      wrap="wrap"
      gap="md"
    >
      <Stack gap={8} miw={0}>
        <Group gap="xs" wrap="wrap">
          {typeof title === "string" ? (
            <Text fz="xl" fw={700} tt="capitalize">
              {title}
            </Text>
          ) : (
            title
          )}

          {badges}
        </Group>

        {subtitle}
      </Stack>

      {figure != null && (
        <Stack gap={2} align="flex-end">
          {figureLabel && (
            <Text fz="xs" c="dimmed" fw={600} tt="uppercase" lts="0.04em">
              {figureLabel}
            </Text>
          )}

          <Text fz={32} fw={700} lh={1.1} className={classes.figure}>
            {figure}
          </Text>

          {figureHint && (
            <Text fz="xs" c="dimmed">
              {figureHint}
            </Text>
          )}
        </Stack>
      )}
    </Group>
  </Paper>
);

export default DetailHero;
