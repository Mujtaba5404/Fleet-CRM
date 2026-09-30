import { Divider, Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import useFilters from "../hooks/useFilters";
import ActiveFilters from "./ActiveFilters";
import SearchInput from "./SearchInput";

/**
 * The strip above every list: quick search, record count and the chips for
 * whatever filters are currently applied.
 *
 * Designed to be handed to `PaginatedTable`'s `toolbar` prop so the count is
 * the real server total rather than the number of rows on this page.
 *
 * @param {Object} props
 * @param {number} props.totalRecords
 * @param {boolean} props.isLoading
 * @param {{key: string, placeholder?: string}} [props.search]
 * @param {Object} [props.filterLabels] Pretty names for filter keys.
 * @param {string} [props.noun]         "vehicle", "policy", …
 */
const isEmpty = (value) =>
  value == null || value === "" || (Array.isArray(value) && value.length === 0);

const ListToolbar = ({
  totalRecords,
  isLoading,
  search,
  filterLabels,
  noun = "record",
  nounPlural = `${noun}s`,
}) => {
  const { filters, setFilters } = useFilters();

  const hasActiveFilters = Object.values(filters).some((v) => !isEmpty(v));

  return (
    <Paper p="sm">
      <Stack gap="sm">
        <Group justify="space-between" gap="sm" wrap="wrap">
          {search && (
            <SearchInput
              w={{ base: "100%", xs: 280 }}
              value={filters[search.key] || ""}
              onChange={(value) => setFilters({ [search.key]: value })}
              placeholder={search.placeholder}
            />
          )}

          {isLoading ? (
            <Skeleton h={16} w={90} radius="sm" />
          ) : (
            <Text fz="sm" c="dimmed">
              <Text component="span" fw={600} c="var(--mantine-color-text)">
                {totalRecords.toLocaleString()}
              </Text>{" "}
              {totalRecords === 1 ? noun : nounPlural}
            </Text>
          )}
        </Group>

        {hasActiveFilters && (
          <>
            <Divider />
            <ActiveFilters labels={filterLabels} />
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default ListToolbar;
