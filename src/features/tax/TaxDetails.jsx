import { Badge, Card, Divider, Grid, Group, Loader, Paper, Progress, SimpleGrid, Stack, Table, Text, ThemeIcon, Timeline, Tooltip } from "@mantine/core";
import {
  IconAlertTriangle,
  IconBan,
  IconBuildingBank,
  IconCalendarEvent,
  IconCalendarOff,
  IconCash,
  IconFileDescription,
  IconLicense,
  IconPlayerPlay,
  IconShieldCheck,
  IconShieldHalf,
  IconUmbrella,
  IconX,
} from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useGetInsuranceByIdQuery } from "../../api/insurance";
import Placeholder from "../../components/Placeholder";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import DeleteInsuranceButton from "./DeleteInsuranceButton";
import EditInsuranceModalButton from "./EditInsuranceModalButton";


const title = (value) => (typeof value === "object" && value?.title ? value.title : null);
const color = (value) => (typeof value === "object" ? value?.color : undefined);

const PicklistBadge = ({ item, fallback = "—", ...props }) => {
  const label = title(item);

  if (!label)
    return (
      <Text size="sm" c={"dimmed"}>
        {fallback}
      </Text>
    );

  return (
    <Badge variant="light" size="sm" color={color(item) || "gray"} tt={"capitalize"} {...props}>
      {label}
    </Badge>
  );
};

const Stat = ({ icon, label, value, hint, color: statColor = "blue" }) => (
  <Card padding="md" radius="md" withBorder>
    <Group gap="sm" align="flex-start" wrap="nowrap">
      <ThemeIcon variant="light" color={statColor} size={38} radius="md">
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

const PanelHeader = ({ icon, title: heading, right }) => (
  <Group justify="space-between" mb="sm">
    <Group gap={8}>
      <ThemeIcon variant="transparent" color="gray" size={20}>
        {icon}
      </ThemeIcon>

      <Text size="sm" fw={600}>
        {heading}
      </Text>
    </Group>

    {right}
  </Group>
);

const daysBetween = (from, to) => {
  if (!from || !to) return null;

  return Math.max(0, Math.round((new Date(to) - new Date(from)) / 86400000));
};

const TaxDetails = () => {
  const { id } = useParams();

  const insurance = useGetInsuranceByIdQuery(id);

  if (insurance.isLoading) return <Loader />;

  if (insurance.isError) return <Placeholder title={insurance.error?.response?.data.message || "Error"} icon={<IconX size={50} />} />;

  const data = insurance.data;
  const fleet = data.fleet;
  const coverages = data.coverages || [];

  const premium = data.totalPremium ?? data.premium ?? 0;
  const payable = data.totalAmount ?? premium;
  const coverageLimit = coverages.length ? coverages.reduce((sum, row) => sum + (Number(row.limit) || 0), 0) : data.coverage || 0;

  const isCancelled = Boolean(data.cancellationDate);
  const isExpired = data.endDate && new Date(data.endDate) < new Date();
  const termDays = daysBetween(data.startDate, data.endDate);
  const daysLeft = data.endDate ? daysBetween(new Date(), data.endDate) : null;
  const elapsedShare = termDays ? Math.min(100, Math.round(((termDays - (daysLeft ?? 0)) / termDays) * 100)) : 0;

  const timelineItems = [
    { key: "created", label: "Policy logged", date: data.createdAt, icon: <IconFileDescription size={12} /> },
    { key: "start", label: "Cover starts", date: data.startDate, icon: <IconPlayerPlay size={12} /> },
    { key: "end", label: "Cover ends", date: data.endDate, icon: <IconCalendarOff size={12} /> },
    { key: "cancelled", label: "Cancelled", date: data.cancellationDate, icon: <IconBan size={12} /> },
  ]
    .filter((item) => item.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Stack>
      {/* hero strip */}
      <Paper p="lg" radius="md" withBorder>
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap={8}>
            <Group gap="xs">
              <Text size="xl" fw={700} tt="uppercase">
                {data.policyNumber || "Policy"}
              </Text>

              <PicklistBadge item={data.status} size="md" />

              {isCancelled ? (
                <Badge variant="light" color="red" size="md" leftSection={<IconBan size={12} />}>
                  Cancelled
                </Badge>
              ) : (
                isExpired && (
                  <Tooltip label="Cover period has ended" withArrow>
                    <Badge variant="outline" color="orange" size="md" leftSection={<IconAlertTriangle size={12} />}>
                      Expired
                    </Badge>
                  </Tooltip>
                )
              )}

              <EditInsuranceModalButton insurance={data} />

              <DeleteInsuranceButton insuranceId={data._id} redirect />
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
              Payable
            </Text>

            <Text fz={32} fw={700} lh={1.1}>
              {formatAmount(payable)}
            </Text>

            <Text size="xs" c="dimmed">
              Logged {formatDate(data.createdAt)}
            </Text>
          </Stack>
        </Group>
      </Paper>

      {/* KPI row */}
      <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
        <Stat icon={<IconUmbrella size={20} />} label="Coverage" value={formatAmount(coverageLimit)} hint={coverages.length ? `${coverages.length} coverages` : "Single limit"} color="grape" />

        <Stat icon={<IconCash size={20} />} label="Premium" value={formatAmount(premium)} hint={data.taxAmount ? `+ tax ${formatAmount(data.taxAmount)}` : "Before tax"} color="teal" />

        <Stat
          icon={<IconShieldHalf size={20} />}
          label="Deductible"
          value={data.deductible != null ? formatAmount(data.deductible) : "—"}
          hint="Paid per claim"
          color="blue"
        />

        <Stat
          icon={<IconCalendarEvent size={20} />}
          label={isCancelled ? "Status" : "Days left"}
          value={isCancelled ? "Cancelled" : daysLeft != null ? `${daysLeft} ${daysLeft === 1 ? "day" : "days"}` : "—"}
          hint={data.endDate ? `Ends ${formatDate(data.endDate)}` : "No end date"}
          color={isCancelled || isExpired ? "red" : "orange"}
        />
      </SimpleGrid>

      <Grid>
        {/* left: term, coverages, money */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack>
            <Paper p="md" radius="md" withBorder>
              <PanelHeader
                icon={<IconShieldCheck size={16} />}
                title="Policy term"
                right={
                  <Text size="xs" c="dimmed">
                    {termDays != null ? `${termDays} day term` : "Open term"}
                  </Text>
                }
              />

              <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md" mb="md">
                <Meta label="Starts">{data.startDate ? formatDate(data.startDate) : "—"}</Meta>

                <Meta label="Ends">{data.endDate ? formatDate(data.endDate) : "—"}</Meta>

                <Meta label="Provider">
                  <PicklistBadge item={data.provider} />
                </Meta>
              </SimpleGrid>

              <Group justify="space-between" mb={4}>
                <Text size="xs" c="dimmed">
                  Term elapsed
                </Text>

                <Text size="xs" fw={600}>
                  {elapsedShare}%
                </Text>
              </Group>

              <Progress value={elapsedShare} size="sm" radius="xl" color={isExpired || isCancelled ? "red" : "blue"} />
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <PanelHeader
                icon={<IconUmbrella size={16} />}
                title="Coverage"
                right={
                  <Badge variant="light" size="lg">
                    {formatAmount(coverageLimit)}
                  </Badge>
                }
              />

              {coverages.length ? (
                <Table highlightOnHover verticalSpacing="xs">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Type</Table.Th>
                      <Table.Th ta="right">Limit</Table.Th>
                      <Table.Th ta="right">Deductible</Table.Th>
                      <Table.Th ta="right">Premium</Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {coverages.map((row, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <PicklistBadge item={row.type} />
                        </Table.Td>

                        <Table.Td ta="right">{formatAmount(row.limit || 0)}</Table.Td>

                        <Table.Td ta="right">{formatAmount(row.deductible || 0)}</Table.Td>

                        <Table.Td ta="right">
                          <Text size="sm" fw={600}>
                            {formatAmount(row.premium || 0)}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              ) : (
                <SimpleGrid cols={{ base: 2 }} spacing="md">
                  <Meta label="Coverage limit">{formatAmount(data.coverage || 0)}</Meta>

                  <Meta label="Breakdown">
                    <Text size="sm" c="dimmed">
                      No coverage lines
                    </Text>
                  </Meta>
                </SimpleGrid>
              )}
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <PanelHeader icon={<IconCash size={16} />} title="Amounts" />

              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                <Meta label="Premium">{formatAmount(premium)}</Meta>

                <Meta label="Tax">{data.taxAmount != null ? formatAmount(data.taxAmount) : "—"}</Meta>

                <Meta label="Discount">{data.discountAmount != null ? `− ${formatAmount(data.discountAmount)}` : "—"}</Meta>

                <Meta label="Total payable">
                  <Text size="sm" fw={700}>
                    {formatAmount(payable)}
                  </Text>
                </Meta>
              </SimpleGrid>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <PanelHeader icon={<IconCalendarEvent size={16} />} title="Policy timeline" />

              {timelineItems.length ? (
                <Timeline active={timelineItems.length - 1} bulletSize={22} lineWidth={2}>
                  {timelineItems.map((item) => (
                    <Timeline.Item key={item.key} bullet={item.icon} title={item.label}>
                      <Text size="xs" c="dimmed">
                        {formatDate(item.date)}
                      </Text>

                      {item.key === "cancelled" && data.cancellationReason && (
                        <Text size="xs" c="red" mt={2}>
                          {data.cancellationReason}
                        </Text>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Text size="sm" c="dimmed">
                  No dates recorded
                </Text>
              )}
            </Paper>
          </Stack>
        </Grid.Col>

        {/* right: parties, cancellation, notes, record */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack>
            <Paper p="md" radius="md" withBorder>
              <PanelHeader icon={<IconBuildingBank size={16} />} title="Parties" />

              <Stack gap="sm">
                <Meta label="Provider">
                  <PicklistBadge item={data.provider} />
                </Meta>

                <Divider />

                <Meta label="Broker">
                  <PicklistBadge item={data.broker} fallback="No broker" />
                </Meta>

                <Divider />

                <Meta label="Policy type">
                  <PicklistBadge item={data.type} />
                </Meta>

                <Divider />

                <Meta label="Company">{title(data.company) || (data.company ? "Not populated" : "—")}</Meta>
              </Stack>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <PanelHeader icon={<IconFileDescription size={16} />} title="Notes" />

              <Text size="sm">{data.notes || "No additional notes"}</Text>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <PanelHeader icon={<IconCalendarEvent size={16} />} title="Record" />

              <Stack gap="sm">
                <Meta label="Created on">{formatDate(data.createdAt)}</Meta>

                <Divider />

                <Meta label="Last updated">{formatDate(data.updatedAt)}</Meta>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default TaxDetails;