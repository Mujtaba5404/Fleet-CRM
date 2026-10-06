import {
  Accordion,
  ActionIcon,
  Badge,
  Center,
  Grid,
  Group,
  Loader,
  Paper,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowsExchange,
  IconCar,
  IconCash,
  IconChartPie,
  IconLayersIntersect,
  IconStack2,
  IconX,
} from "@tabler/icons-react";
import { useGetfleetSummaryByGroupQuery } from "../api/fleet";
import DetailPanel from "../components/DetailPanel";
import PageHeader from "../components/PageHeader";
import Placeholder from "../components/Placeholder";
import StatTile from "../components/StatTile";
import FLEET_GROUP_FIELDS, {
  DEFAULT_PRIMARY_GROUP,
  DEFAULT_SECONDARY_GROUP,
  groupFieldLabel,
} from "../constants/FLEET_GROUP_FIELDS";
import useFilters from "../hooks/useFilters";
import formatAmount from "../utils/formatAmount";

const share = (value, total) => (total ? Math.round((value / total) * 100) : 0);

/** A figure with its caption underneath, right-aligned. */
const Figure = ({ value, caption }) => (
  <Stack gap={0} align="flex-end" style={{ flexShrink: 0 }}>
    <Text fz="sm" fw={600} className="numeric">
      {value}
    </Text>

    <Text fz={10} c="dimmed" tt="uppercase" lts="0.04em">
      {caption}
    </Text>
  </Stack>
);

/** One line of the secondary totals list: badge, share bar, count and amount. */
const ShareRow = ({ row, total }) => {
  const percent = share(row.count, total);

  return (
    <Stack gap={6}>
      <Group justify="space-between" wrap="nowrap" gap="sm">
        <Badge color={row.color || "gray"} tt="capitalize">
          {row.title || "Unspecified"}
        </Badge>

        <Group gap={6} wrap="nowrap">
          <Text fz="sm" fw={600} className="numeric">
            {row.count}
          </Text>

          <Text fz="xs" c="dimmed" className="numeric">
            ({percent}%)
          </Text>
        </Group>
      </Group>

      <Progress
        value={percent}
        color={row.color || "gray"}
        size="sm"
        radius="xl"
      />

      <Text fz="xs" c="dimmed" className="numeric">
        {formatAmount(row.purchaseAmount || 0)}
      </Text>
    </Stack>
  );
};

const FleetSummaryPage = () => {
  const { filters, setFilters } = useFilters();

  // Groupings live in the URL, so a particular view can be shared or bookmarked.
  const primaryGroup = filters.primaryGroup || DEFAULT_PRIMARY_GROUP;
  const secondaryGroup = filters.secondaryGroup || DEFAULT_SECONDARY_GROUP;

  const primaryLabel = groupFieldLabel(primaryGroup);
  const secondaryLabel = groupFieldLabel(secondaryGroup);

  const summary = useGetfleetSummaryByGroupQuery({
    primaryGroup,
    secondaryGroup,
  });

  const primaryGroups = summary.data?.primaryGroupWise ?? [];
  const secondaryGroups = summary.data?.secondaryGroupWise ?? [];
  const totalCount = summary.data?.totalCount ?? 0;
  const totalPurchaseAmount = summary.data?.totalPurchaseAmount ?? 0;

  // Grouping a field by itself tells you nothing, so block the overlap.
  const optionsFor = (excluded) =>
    FLEET_GROUP_FIELDS.map((field) => ({
      ...field,
      disabled: field.value === excluded,
    }));

  const swapGroups = () =>
    setFilters({ primaryGroup: secondaryGroup, secondaryGroup: primaryGroup });

  return (
    <>
      <PageHeader
        title="Fleet summary"
        description="Vehicle counts and purchase value, grouped two levels deep."
        breadcrumbs={[{ label: "Fleet" }, { label: "Summary" }]}
      />

      <Stack gap="md">
        <Paper p="sm">
          <Group gap="sm" align="flex-end" wrap="wrap">
            <Select
              label="Group by"
              w={{ base: "100%", xs: 220 }}
              value={primaryGroup}
              data={optionsFor(secondaryGroup)}
              onChange={(value) => value && setFilters({ primaryGroup: value })}
              searchable={false}
              allowDeselect={false}
            />

            <Tooltip label="Swap groupings" withArrow>
              <ActionIcon
                size="lg"
                variant="default"
                mb={4}
                onClick={swapGroups}
                aria-label="Swap groupings"
              >
                <IconArrowsExchange size={18} />
              </ActionIcon>
            </Tooltip>

            <Select
              label="Then by"
              w={{ base: "100%", xs: 220 }}
              value={secondaryGroup}
              data={optionsFor(primaryGroup)}
              onChange={(value) =>
                value && setFilters({ secondaryGroup: value })
              }
              searchable={false}
              allowDeselect={false}
            />

            <Text fz="xs" c="dimmed" mb={10} ml="auto">
              {primaryLabel} → {secondaryLabel}
            </Text>
          </Group>
        </Paper>

        {summary.isLoading ? (
          <Center h={320}>
            <Loader />
          </Center>
        ) : summary.isError ? (
          <Placeholder
            title={
              summary.error?.response?.data?.message ||
              summary.error?.message ||
              "Could not load the summary"
            }
            description="The grouping may not be supported for this field."
            icon={<IconX size={32} />}
          />
        ) : !totalCount ? (
          <Placeholder
            title="Nothing to summarise yet"
            description="Add vehicles to your fleet and their breakdown will appear here."
            icon={<IconChartPie size={32} />}
          />
        ) : (
          <>
            <SimpleGrid cols={{ base: 2, lg: 4 }} spacing="md">
              <StatTile
                label="Vehicles"
                value={totalCount.toLocaleString()}
                hint="In this summary"
                icon={IconCar}
              />

              <StatTile
                label="Purchase value"
                value={formatAmount(totalPurchaseAmount)}
                hint="Across the fleet"
                icon={IconCash}
                color="teal"
              />

              <StatTile
                label={`${primaryLabel} groups`}
                value={primaryGroups.length}
                hint={`Distinct ${primaryLabel.toLowerCase()} values`}
                icon={IconStack2}
                color="grape"
              />

              <StatTile
                label="Average per vehicle"
                value={formatAmount(
                  totalCount ? totalPurchaseAmount / totalCount : 0,
                )}
                hint="Purchase value"
                icon={IconLayersIntersect}
                color="cyan"
              />
            </SimpleGrid>

            <DetailPanel title={`Mix by ${primaryLabel}`} icon={IconChartPie}>
              <Stack gap="sm">
                <Progress.Root size={18} radius="sm">
                  {primaryGroups.map((group) => (
                    <Progress.Section
                      key={group._id}
                      value={share(group.count, totalCount)}
                      color={group.color || "gray"}
                    >
                      <Progress.Label>{group.count}</Progress.Label>
                    </Progress.Section>
                  ))}
                </Progress.Root>

                <Group gap="xs">
                  {primaryGroups.map((group) => (
                    <Badge
                      key={group._id}
                      color={group.color || "gray"}
                      tt="capitalize"
                    >
                      {group.title || "Unspecified"} · {group.count}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            </DetailPanel>

            <Grid>
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <DetailPanel
                  title={`Breakdown by ${primaryLabel}`}
                  icon={IconStack2}
                  action={
                    <Text fz="xs" c="dimmed">
                      Expand for {secondaryLabel.toLowerCase()}
                    </Text>
                  }
                >
                  <Accordion
                    variant="separated"
                    radius="md"
                    chevronPosition="left"
                    defaultValue={primaryGroups[0]?._id}
                  >
                    {primaryGroups.map((group) => {
                      const rows = group.secondaryGroupWise ?? [];

                      return (
                        <Accordion.Item key={group._id} value={group._id}>
                          <Accordion.Control>
                            <Group
                              justify="space-between"
                              wrap="nowrap"
                              gap="md"
                              pr="sm"
                            >
                              <Group gap="sm" wrap="nowrap" miw={0}>
                                <Badge
                                  size="lg"
                                  color={group.color || "gray"}
                                  tt="capitalize"
                                >
                                  {group.title || "Unspecified"}
                                </Badge>

                                <Text fz="xs" c="dimmed" visibleFrom="sm">
                                  {rows.length} {secondaryLabel.toLowerCase()}
                                  {rows.length === 1 ? "" : "s"}
                                </Text>
                              </Group>

                              <Group gap="lg" wrap="nowrap">
                                <Figure
                                  value={group.count}
                                  caption="Vehicles"
                                />

                                <Figure
                                  value={formatAmount(
                                    group.purchaseAmount || 0,
                                  )}
                                  caption={`${share(group.count, totalCount)}% of fleet`}
                                />
                              </Group>
                            </Group>
                          </Accordion.Control>

                          <Accordion.Panel>
                            {rows.length ? (
                              <Table.ScrollContainer minWidth={380}>
                                <Table verticalSpacing="xs" highlightOnHover>
                                  <Table.Thead>
                                    <Table.Tr>
                                      <Table.Th>{secondaryLabel}</Table.Th>
                                      <Table.Th ta="right">Vehicles</Table.Th>
                                      <Table.Th ta="right">Share</Table.Th>
                                      <Table.Th ta="right">
                                        Purchase value
                                      </Table.Th>
                                    </Table.Tr>
                                  </Table.Thead>

                                  <Table.Tbody>
                                    {rows.map((row) => (
                                      <Table.Tr key={row._id}>
                                        <Table.Td>
                                          <Badge
                                            color={row.color || "gray"}
                                            tt="capitalize"
                                          >
                                            {row.title || "Unspecified"}
                                          </Badge>
                                        </Table.Td>

                                        <Table.Td ta="right">
                                          {row.count}
                                        </Table.Td>

                                        <Table.Td ta="right">
                                          {share(row.count, group.count)}%
                                        </Table.Td>

                                        <Table.Td ta="right">
                                          <Text fz="sm" fw={600}>
                                            {formatAmount(
                                              row.purchaseAmount || 0,
                                            )}
                                          </Text>
                                        </Table.Td>
                                      </Table.Tr>
                                    ))}
                                  </Table.Tbody>
                                </Table>
                              </Table.ScrollContainer>
                            ) : (
                              <Text fz="sm" c="dimmed">
                                No {secondaryLabel.toLowerCase()} recorded for
                                this group
                              </Text>
                            )}
                          </Accordion.Panel>
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                </DetailPanel>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 4 }}>
                <DetailPanel
                  title={`Totals by ${secondaryLabel}`}
                  icon={IconLayersIntersect}
                  h="100%"
                >
                  {secondaryGroups.length ? (
                    <Stack gap="md">
                      {secondaryGroups.map((row) => (
                        <ShareRow key={row._id} row={row} total={totalCount} />
                      ))}
                    </Stack>
                  ) : (
                    <Text fz="sm" c="dimmed">
                      Nothing recorded
                    </Text>
                  )}
                </DetailPanel>
              </Grid.Col>
            </Grid>
          </>
        )}
      </Stack>
    </>
  );
};

export default FleetSummaryPage;
