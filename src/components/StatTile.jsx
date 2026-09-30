import { Group, Paper, Skeleton, Stack, Text, ThemeIcon } from "@mantine/core";
import { Link } from "react-router-dom";

/**
 * One headline number with a label and an optional caption.
 *
 * Used by the dashboard KPI row and by the detail screens, which each had
 * their own `Stat` before. Figures use tabular numerals (see `.numeric` in
 * index.css) so columns of amounts line up digit for digit.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {Function} props.icon    Tabler icon component.
 * @param {string} [props.color]   Mantine colour key.
 * @param {string} [props.hint]
 * @param {string} [props.to]      Makes the whole tile a link.
 * @param {boolean} [props.loading]
 */
const StatTile = ({
  label,
  value,
  icon: Icon,
  color = "brand",
  hint,
  to,
  loading = false,
}) => (
  <Paper
    p="md"
    component={to ? Link : "div"}
    to={to}
    data-interactive={to ? true : undefined}
    style={to ? { textDecoration: "none", color: "inherit" } : undefined}
  >
    <Group justify="space-between" wrap="nowrap" align="flex-start" gap="sm">
      <Stack gap={4} miw={0}>
        <Text fz="xs" fw={600} c="dimmed" tt="uppercase" lts="0.04em" truncate>
          {label}
        </Text>

        {loading ? (
          <Skeleton h={28} w={72} radius="sm" />
        ) : (
          <Text fz={26} fw={700} lh={1.1} className="numeric" truncate>
            {value}
          </Text>
        )}

        {hint && (
          <Text fz="xs" c="dimmed" truncate>
            {hint}
          </Text>
        )}
      </Stack>

      {Icon && (
        <ThemeIcon size={42} radius="md" variant="light" color={color}>
          <Icon size={22} stroke={1.6} />
        </ThemeIcon>
      )}
    </Group>
  </Paper>
);

export default StatTile;
