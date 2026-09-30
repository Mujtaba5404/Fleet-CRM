import { Badge, Button, Group, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import useFilters from "../hooks/useFilters";
import formatDate from "../utils/formatDate";

const isEmpty = (value) =>
  value == null || value === "" || (Array.isArray(value) && value.length === 0);

const humanise = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();

const describe = (value) => {
  if (Array.isArray(value)) {
    const dates = value.filter((item) => item instanceof Date);

    if (dates.length) {
      return dates.map(formatDate).join(" → ");
    }

    return `${value.length} selected`;
  }

  if (value instanceof Date) return formatDate(value);

  return String(value);
};

/**
 * Removable chips for whatever filters are currently in the URL.
 *
 * Without these the filter drawer is a black box — you close it and forget a
 * filter is still narrowing the list.
 *
 * @param {Object} [props.labels] Override the generated label per filter key.
 */
const ActiveFilters = ({ labels = {} }) => {
  const { filters, setFilters, resetFilters } = useFilters();

  const entries = Object.entries(filters).filter(
    ([, value]) => !isEmpty(value),
  );

  if (!entries.length) return null;

  return (
    <Group gap={6} wrap="wrap">
      <Text fz="xs" c="dimmed" fw={500}>
        Filtered by
      </Text>

      {entries.map(([key, value]) => (
        <Badge
          key={key}
          variant="light"
          size="lg"
          tt="none"
          fw={500}
          rightSection={
            <IconX
              size={13}
              style={{ cursor: "pointer", display: "block" }}
              onClick={() => setFilters({ [key]: null })}
              aria-label={`Remove ${labels[key] ?? humanise(key)} filter`}
            />
          }
        >
          {labels[key] ?? humanise(key)}: {describe(value)}
        </Badge>
      ))}

      <Button
        size="compact-xs"
        variant="subtle"
        color="red"
        onClick={() => resetFilters()}
      >
        Clear all
      </Button>
    </Group>
  );
};

export default ActiveFilters;
