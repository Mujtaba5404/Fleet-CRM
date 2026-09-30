import {
  Badge,
  Box,
  Center,
  Grid,
  Group,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Timeline,
  Tooltip,
} from "@mantine/core";
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
import DetailHero from "../../components/DetailHero";
import DetailPanel from "../../components/DetailPanel";
import PageHeader from "../../components/PageHeader";
import PicklistBadge from "../../components/PicklistBadge";
import Placeholder from "../../components/Placeholder";
import StatTile from "../../components/StatTile";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import DeleteMaintenanceButton from "./DeleteMaintenanceButton";
import EditMaintenanceModalButton from "./EditMaintenanceModalButton";

const daysBetween = (from, to) => {
  if (!from || !to) return null;

  return Math.max(0, Math.round((new Date(to) - new Date(from)) / 86400000));
};

const MaintenanceDetails = () => {
  const { id } = useParams();

  const maintenance = useGetMaintenanceByIdQuery(id);

  if (maintenance.isLoading)
    return (
      <Center h={320}>
        <Loader />
      </Center>
    );

  if (maintenance.isError)
    return (
      <>
        <PageHeader
          back
          title="Maintenance"
          breadcrumbs={[
            { label: "Fleet" },
            { label: "Maintenance", to: "/maintenance" },
          ]}
        />

        <Placeholder
          title={
            maintenance.error?.response?.data?.message ||
            maintenance.error?.message ||
            "Error"
          }
          description="We could not load this maintenance job. It may have been deleted."
          icon={<IconX size={32} />}
        />
      </>
    );

  const data = maintenance.data;
  const fleet = data.fleet;
  const components = data.components || [];
  const checklist = data.checklist || [];

  const partsTotal = components.reduce(
    (sum, row) => sum + (Number(row.totalCost) || 0),
    0,
  );
  const labour = (Number(data.cost) || 0) - partsTotal;
  const partsShare = data.cost ? Math.round((partsTotal / data.cost) * 100) : 0;
  const duration = daysBetween(data.startedDate, data.endDate);

  const timelineItems = [
    {
      key: "reported",
      label: "Reported",
      date: data.createdAt,
      icon: <IconFlag size={12} />,
    },
    {
      key: "assigned",
      label: "Assigned",
      date: data.assignedOn,
      icon: <IconUserCheck size={12} />,
    },
    {
      key: "started",
      label: "Work started",
      date: data.startedDate,
      icon: <IconPlayerPlay size={12} />,
    },
    {
      key: "completed",
      label: "Completed",
      date: data.endDate,
      icon: <IconCalendarCheck size={12} />,
    },
  ].filter((item) => item.date);

  return (
    <>
      <PageHeader
        back
        title={data.type?.title || "Maintenance"}
        description={`Logged ${formatDate(data.createdAt)}`}
        breadcrumbs={[
          { label: "Fleet" },
          { label: "Maintenance", to: "/maintenance" },
          { label: fleet?.licensePlate || data.type?.title || "Job" },
        ]}
        actions={
          <>
            <EditMaintenanceModalButton maintenance={data} variant="button" />

            <DeleteMaintenanceButton
              maintenanceId={data._id}
              redirect
              variant="button"
            />
          </>
        }
      />

      <Stack gap="md">
        <DetailHero
          railColor={data.status?.color}
          title={data.type?.title || "Maintenance"}
          badges={
            <>
              <PicklistBadge item={data.status} size="md" />

              <Tooltip label="Priority" withArrow>
                <Badge
                  variant="outline"
                  size="md"
                  color={data.priority?.color || "gray"}
                  leftSection={<IconAlertTriangle size={12} />}
                  tt="capitalize"
                >
                  {data.priority?.title || "—"}
                </Badge>
              </Tooltip>
            </>
          }
          subtitle={
            fleet && (
              <Group
                gap={8}
                component={Link}
                to={`/fleets/${fleet._id}`}
                style={{ textDecoration: "none" }}
              >
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
            )
          }
          figureLabel="Total cost"
          figure={formatAmount(data.cost || 0)}
          figureHint={`Logged ${formatDate(data.createdAt)}`}
        />

        <SimpleGrid cols={{ base: 2, lg: 4 }} spacing="md">
          <StatTile
            icon={IconTool}
            label="Parts"
            value={formatAmount(partsTotal)}
            hint={`${components.length} ${components.length === 1 ? "component" : "components"}`}
            color="grape"
          />

          <StatTile
            icon={IconCash}
            label="Labour & other"
            value={formatAmount(labour > 0 ? labour : 0)}
            hint={`${100 - partsShare}% of total`}
            color="teal"
          />

          <StatTile
            icon={IconGauge}
            label="Odometer"
            value={data.odometer != null ? data.odometer.toLocaleString() : "—"}
            hint="At service"
          />

          <StatTile
            icon={IconCalendarEvent}
            label="Duration"
            value={
              duration != null
                ? `${duration} ${duration === 1 ? "day" : "days"}`
                : "Open"
            }
            hint={
              data.endDate
                ? `Ended ${formatDate(data.endDate)}`
                : "Not completed"
            }
            color="orange"
          />
        </SimpleGrid>

        <Grid>
          {/* left: timeline + parts + checklist */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="md">
              <DetailPanel
                title="Job timeline"
                icon={IconClipboardText}
                action={
                  <Text size="xs" c="dimmed">
                    {data.provider?.title
                      ? `Handled by ${data.provider.title}`
                      : "No provider"}
                  </Text>
                }
              >
                {timelineItems.length ? (
                  <Timeline
                    active={timelineItems.length - 1}
                    bulletSize={22}
                    lineWidth={2}
                  >
                    {timelineItems.map((item) => (
                      <Timeline.Item
                        key={item.key}
                        bullet={item.icon}
                        title={item.label}
                      >
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
              </DetailPanel>

              <DetailPanel
                title="Parts & components"
                icon={IconTool}
                action={
                  <Badge size="lg" className="numeric">
                    {formatAmount(partsTotal)}
                  </Badge>
                }
              >
                {components.length ? (
                  <>
                    <Table.ScrollContainer minWidth={420}>
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

                              <Table.Td ta="center">
                                {row.quantity ?? "—"}
                              </Table.Td>

                              <Table.Td ta="right">
                                {formatAmount(row.unitCost || 0)}
                              </Table.Td>

                              <Table.Td ta="right">
                                <Text size="sm" fw={600}>
                                  {formatAmount(row.totalCost || 0)}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Table.ScrollContainer>

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
              </DetailPanel>

              <DetailPanel
                title="Inspection checklist"
                icon={IconChecklist}
                action={
                  <Badge size="lg" color="gray">
                    {checklist.length}{" "}
                    {checklist.length === 1 ? "check" : "checks"}
                  </Badge>
                }
              >
                {checklist.length ? (
                  <Stack gap="xs">
                    {checklist.map((row, index) => (
                      <Group key={index} justify="space-between" wrap="nowrap">
                        <Group gap="xs" wrap="nowrap" miw={0}>
                          <ThemeIcon
                            variant="light"
                            color={row.status?.color || "gray"}
                            size={26}
                            radius="sm"
                          >
                            <IconChecklist size={14} />
                          </ThemeIcon>

                          <Text size="sm" fw={500} tt="capitalize" truncate>
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
              </DetailPanel>
            </Stack>
          </Grid.Col>

          {/* right: people, notes, record */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="md">
              <DetailPanel title="People" icon={IconUserCheck}>
                <DetailPanel.FieldList>
                  <DetailPanel.Field label="Reported by">
                    {data.reportedBy?.name ||
                      (data.reportedBy ? "Not populated" : "—")}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Assigned to">
                    {data.assignedTo?.name ||
                      (data.assignedTo ? "Not populated" : "Unassigned")}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Provider">
                    <PicklistBadge item={data.provider} />
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Company">
                    {data.company?.title ||
                      (data.company ? "Not populated" : "—")}
                  </DetailPanel.Field>
                </DetailPanel.FieldList>
              </DetailPanel>

              <DetailPanel title="Notes" icon={IconFileDescription}>
                <Text size="sm">{data.notes || "No additional notes"}</Text>
              </DetailPanel>

              <DetailPanel title="Record" icon={IconCalendarEvent}>
                <DetailPanel.FieldList>
                  <DetailPanel.Field label="Created on" numeric>
                    {formatDate(data.createdAt)}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Last updated" numeric>
                    {formatDate(data.updatedAt)}
                  </DetailPanel.Field>
                </DetailPanel.FieldList>
              </DetailPanel>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
};

export default MaintenanceDetails;
