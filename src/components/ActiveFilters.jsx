import { Badge, Button, Group, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import useFilters from "../hooks/useFilters";
import formatDate from "../utils/formatDate";

// A cleared date range comes back as [null, null] rather than disappearing, so
// an array counts as empty when nothing inside it survives either.
const isEmpty = (value) =>
  value == null ||
  value === "" ||
  (Array.isArray(value) && (!value.length || value.every(isEmpty)));

const humanise = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();

const describe = (value) => {
  if (value instanceof Date) return formatDate(value);

  if (Array.isArray(value)) {
    // A date range arrives as [from, to], and either end may be left open.
    // Note the arrow: passing formatDate straight to map hands it the array
    // index as its `format` argument, which dayjs then tries to call .replace on.
    if (value.some((item) => item instanceof Date)) {
      return value
        .map((item) => (item instanceof Date ? formatDate(item) : "any"))
        .join(" → ");
    }

    return `${value.length} selected`;
  }

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
