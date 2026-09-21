import { Badge, Box, Card, Divider, Grid, Group, Loader, Paper, Progress, SimpleGrid, Stack, Table, Text, ThemeIcon, Timeline, Tooltip } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCalendarCheck,
  IconCalendarEvent,
  IconCash,
  IconChecklist,
  IconClipboardText,
  IconFileDescription,
  IconFlag,
  IconGauge,
  IconLicense,
  IconPlayerPlay,
  IconTool,
  IconUserCheck,
  IconX,
} from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useGetMaintenanceByIdQuery } from "../../api/maintenance";
import Placeholder from "../../components/Placeholder";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import DeleteMaintenanceButton from "./DeleteMaintenanceButton";
import EditMaintenanceModalButton from "./EditMaintenanceModalButton";

const PicklistBadge = ({ item, ...props }) => {
  if (!item?.title)
    return (
      <Text size="sm" c={"dimmed"}>
        —
      </Text>
    );

  return (
    <Badge variant="light" size="sm" color={item.color || "gray"} tt={"capitalize"} {...props}>
      {item.title}
    </Badge>
  );
};

const Stat = ({ icon, label, value, hint, color = "blue" }) => (
  <Card padding="md" radius="md" withBorder>
    <Group gap="sm" align="flex-start" wrap="nowrap">
      <ThemeIcon variant="light" color={color} size={38} radius="md">
        {icon}
      </ThemeIcon>

      <Stack gap={0} style={{ minWidth: 0 }}>
        <Text size="xs" c="dimmed" fw={500} tt="uppercase">
          {label}
        </Text>

        <Text size="xl" fw={700} lh={1.2}>
          {value}
        </Text>

        {hint && (
          <Text size="xs" c="dimmed" mt={2}>
            {hint}
          </Text>
        )}
      </Stack>
    </Group>
  </Card>
);

const Meta = ({ label, children }) => (
  <Stack gap={2}>
    <Text size="xs" c="dimmed" fw={500}>
      {label}
    </Text>

    {typeof children === "string" || typeof children === "number" ? (
      <Text size="sm" fw={500} tt="capitalize">
        {children}
      </Text>
    ) : (
      children
    )}
  </Stack>
);

const PanelHeader = ({ icon, title, right }) => (
  <Group justify="space-between" mb="sm">
    <Group gap={8}>
      <ThemeIcon variant="transparent" color="gray" size={20}>
        {icon}
      </ThemeIcon>

      <Text size="sm" fw={600}>
        {title}
      </Text>
    </Group>

    {right}
  </Group>
);

const daysBetween = (from, to) => {
  if (!from || !to) return null;

  return Math.max(0, Math.round((new Date(to) - new Date(from)) / 86400000));
};

const MaintenanceDetails = () => {
  const { id } = useParams();

  const maintenance = useGetMaintenanceByIdQuery(id);

  if (maintenance.isLoading) return <Loader />;

  if (maintenance.isError) return <Placeholder title={maintenance.error?.response?.data.message || "Error"} icon={<IconX size={50} />} />;

  const data = maintenance.data;
  const fleet = data.fleet;
  const components = data.components || [];
  const checklist = data.checklist || [];

  const partsTotal = components.reduce((sum, row) => sum + (Number(row.totalCost) || 0), 0);
  const labour = (Number(data.cost) || 0) - partsTotal;
  const partsShare = data.cost ? Math.round((partsTotal / data.cost) * 100) : 0;
  const duration = daysBetween(data.startedDate, data.endDate);

  const timelineItems = [
    { key: "reported", label: "Reported", date: data.createdAt, icon: <IconFlag size={12} /> },
    { key: "assigned", label: "Assigned", date: data.assignedOn, icon: <IconUserCheck size={12} /> },
    { key: "started", label: "Work started", date: data.startedDate, icon: <IconPlayerPlay size={12} /> },
    { key: "completed", label: "Completed", date: data.endDate, icon: <IconCalendarCheck size={12} /> },
  ].filter((item) => item.date);

  return (
    <Stack>
      {/* hero strip */}
      <Paper p="lg" radius="md" withBorder>
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap={8}>
            <Group gap="xs">
              <Text size="xl" fw={700} tt="capitalize">
                {data.type?.title || "Maintenance"}
              </Text>

              <PicklistBadge item={data.status} size="md" />

              <Tooltip label="Priority" withArrow>
                <Badge variant="outline" size="md" color={data.priority?.color || "gray"} leftSection={<IconAlertTriangle size={12} />} tt="capitalize">
                  {data.priority?.title || "—"}
                </Badge>
              </Tooltip>

              <EditMaintenanceModalButton maintenance={data} />

              <DeleteMaintenanceButton maintenanceId={data._id} redirect />
            </Group>

            {fleet && (
              <Group gap={8} component={Link} to={`/fleets/${fleet._id}`} style={{ textDecoration: "none" }}>
                <ThemeIcon variant="light" size={22} radius="sm">
                  <IconLicense size={14} />
                </ThemeIcon>

                <Text size="sm" fw={600} tt="uppercase">
                  {fleet.licensePlate || "—"}
                </Text>

                <Text size="sm" c="dimmed" tt="capitalize">
                  {[fleet.year, fleet.color].filter(Boolean).join(" · ")}
                </Text>
              </Group>
            )}
          </Stack>

          <Stack gap={2} align="flex-end">
            <Text size="xs" c="dimmed" fw={500} tt="uppercase">
              Total cost
            </Text>

            <Text fz={32} fw={700} lh={1.1}>
              {formatAmount(data.cost || 0)}
            </Text>

            <Text size="xs" c="dimmed">
              Logged {formatDate(data.createdAt)}
            </Text>
          </Stack>
        </Group>
      </Paper>

      {/* KPI row */}
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
        <Stat
          icon={<IconTool size={20} />}
          label="Parts"
          value={formatAmount(partsTotal)}
          hint={`${components.length} ${components.length === 1 ? "component" : "components"}`}
          color="grape"
        />

        <Stat icon={<IconCash size={20} />} label="Labour & other" value={formatAmount(labour > 0 ? labour : 0)} hint={`${100 - partsShare}% of total`} color="teal" />

        <Stat icon={<IconGauge size={20} />} label="Odometer" value={data.odometer != null ? data.odometer.toLocaleString() : "—"} hint="At service" color="blue" />

        <Stat
          icon={<IconCalendarEvent size={20} />}
          label="Duration"
          value={duration != null ? `${duration} ${duration === 1 ? "day" : "days"}` : "Open"}
          hint={data.endDate ? `Ended ${formatDate(data.endDate)}` : "Not completed"}
          color="orange"
        />
      </SimpleGrid>

      <Grid>
        {/* left: progress + parts + checklist */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack>
            <Paper p="md" radius="md" withBorder>
              <PanelHeader
                icon={<IconClipboardText size={16} />}
                title="Job timeline"
                right={
                  <Text size="xs" c="dimmed">
                    {data.provider?.title ? `Handled by ${data.provider.title}` : "No provider"}
                  </Text>
                }
              />

              {timelineItems.length ? (
                <Timeline active={timelineItems.length - 1} bulletSize={22} lineWidth={2}>
                  {timelineItems.map((item) => (
                    <Timeline.Item key={item.key} bullet={item.icon} title={item.label}>
                      <Text size="xs" c="dimmed">
                        {formatDate(item.date)}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Text size="sm" c="dimmed">
                  No dates recorded
                </Text>
              )}
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <PanelHeader
                icon={<IconTool size={16} />}
                title="Parts & components"
                right={
                  <Badge variant="light" size="lg">
                    {formatAmount(partsTotal)}
                  </Badge>
                }
              />

              {components.length ? (
                <>
                  <Table highlightOnHover verticalSpacing="xs">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Component</Table.Th>
                        <Table.Th ta="center">Qty</Table.Th>
                        <Table.Th ta="right">Unit</Table.Th>
                        <Table.Th ta="right">Total</Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {components.map((row, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>
                            <PicklistBadge item={row.component} />
                          </Table.Td>

                          <Table.Td ta="center">{row.quantity ?? "—"}</Table.Td>

                          <Table.Td ta="right">{formatAmount(row.unitCost || 0)}</Table.Td>

                          <Table.Td ta="right">
                            <Text size="sm" fw={600}>
                              {formatAmount(row.totalCost || 0)}
                            </Text>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>

                  <Box mt="md">
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" c="dimmed">
                        Parts share of total cost
                      </Text>

                      <Text size="xs" fw={600}>
                        {partsShare}%
                      </Text>
                    </Group>

                    <Progress value={partsShare} size="sm" radius="xl" />
                  </Box>
                </>
              ) : (
                <Text size="sm" c="dimmed">
                  No parts recorded
                </Text>
              )}
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <PanelHeader
                icon={<IconChecklist size={16} />}
                title="Inspection checklist"
                right={
                  <Badge variant="light" size="lg" color="gray">
                    {checklist.length} {checklist.length === 1 ? "check" : "checks"}
                  </Badge>
                }
              />

              {checklist.length ? (
                <Stack gap="xs">
                  {checklist.map((row, index) => (
                    <Group key={index} justify="space-between" wrap="nowrap">
                      <Group gap="xs" wrap="nowrap">
                        <ThemeIcon variant="light" color={row.status?.color || "gray"} size={26} radius="sm">
                          <IconChecklist size={14} />
                        </ThemeIcon>

                        <Text size="sm" fw={500} tt="capitalize">
                          {row.item?.title || "—"}
                        </Text>
                      </Group>

                      <Group gap={6} wrap="nowrap">
                        <PicklistBadge item={row.status} />
                        <PicklistBadge item={row.condition} />
                      </Group>
                    </Group>
                  ))}
                </Stack>
              ) : (
                <Text size="sm" c="dimmed">
                  Nothing inspected
                </Text>
              )}
            </Paper>
          </Stack>
        </Grid.Col>

        {/* right: people, notes, record */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack>
            <Paper p="md" radius="md" withBorder>
              <PanelHeader icon={<IconUserCheck size={16} />} title="People" />

              <Stack gap="sm">
                <Meta label="Reported by">{data.reportedBy?.name || (data.reportedBy ? "Not populated" : "—")}</Meta>

                <Divider />

                <Meta label="Assigned to">{data.assignedTo?.name || (data.assignedTo ? "Not populated" : "Unassigned")}</Meta>

                <Divider />

                <Meta label="Provider">
                  <PicklistBadge item={data.provider} />
                </Meta>

                <Divider />

                <Meta label="Company">{data.company?.title || (data.company ? "Not populated" : "—")}</Meta>
              </Stack>
            </Paper>


            <Paper p="md" radius="md" withBorder>
              <PanelHeader icon={<IconCalendarEvent size={16} />} title="Record" />

              <Stack gap="sm">
                <Meta label="Created on">{formatDate(data.createdAt)}</Meta>

                <Divider />

                <Meta label="Last updated">{formatDate(data.updatedAt)}</Meta>
              </Stack>
            </Paper>
            <Paper p="md" radius="md" withBorder>
              <PanelHeader icon={<IconFileDescription size={16} />} title="Notes" />

              <Text size="sm">{data.notes || "No additional notes"}</Text>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default MaintenanceDetails;