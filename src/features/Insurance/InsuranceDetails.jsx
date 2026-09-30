import {
  Badge,
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
import DetailHero from "../../components/DetailHero";
import DetailPanel from "../../components/DetailPanel";
import PageHeader from "../../components/PageHeader";
import PicklistBadge from "../../components/PicklistBadge";
import Placeholder from "../../components/Placeholder";
import StatTile from "../../components/StatTile";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import DeleteInsuranceButton from "./DeleteInsuranceButton";
import EditInsuranceModalButton from "./EditInsuranceModalButton";

const Field = DetailPanel.Field;

const title = (value) =>
  typeof value === "object" && value?.title ? value.title : null;

const daysBetween = (from, to) => {
  if (!from || !to) return null;

  return Math.max(0, Math.round((new Date(to) - new Date(from)) / 86400000));
};

const InsuranceDetails = () => {
  const { id } = useParams();

  const insurance = useGetInsuranceByIdQuery(id);

  if (insurance.isLoading)
    return (
      <Center h={320}>
        <Loader />
      </Center>
    );

  if (insurance.isError)
    return (
      <>
        <PageHeader
          back
          title="Policy"
          breadcrumbs={[
            { label: "Fleet" },
            { label: "Insurance", to: "/insurance" },
          ]}
        />

        <Placeholder
          title={
            insurance.error?.response?.data?.message ||
            insurance.error?.message ||
            "Error"
          }
          description="We could not load this policy. It may have been deleted."
          icon={<IconX size={32} />}
        />
      </>
    );

  const data = insurance.data;
  const fleet = data?.fleet;
  const coverages = data.coverages || [];

  const premium = data.totalPremium ?? data.premium ?? 0;
  const payable = data.totalAmount ?? premium;
  const coverageLimit = coverages.length
    ? coverages.reduce((sum, row) => sum + (Number(row.limit) || 0), 0)
    : data.coverage || 0;

  const isCancelled = Boolean(data.cancellationDate);
  const isExpired = data.endDate && new Date(data.endDate) < new Date();
  const termDays = daysBetween(data.startDate, data.endDate);
  const daysLeft = data.endDate ? daysBetween(new Date(), data.endDate) : null;
  const elapsedShare = termDays
    ? Math.min(100, Math.round(((termDays - (daysLeft ?? 0)) / termDays) * 100))
    : 0;

  const timelineItems = [
    {
      key: "created",
      label: "Policy logged",
      date: data.createdAt,
      icon: <IconFileDescription size={12} />,
    },
    {
      key: "start",
      label: "Cover starts",
      date: data.startDate,
      icon: <IconPlayerPlay size={12} />,
    },
    {
      key: "end",
      label: "Cover ends",
      date: data.endDate,
      icon: <IconCalendarOff size={12} />,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      date: data.cancellationDate,
      icon: <IconBan size={12} />,
    },
  ]
    .filter((item) => item.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // The rail reflects the strongest signal: cancelled beats expired beats status.
  const railColor = isCancelled
    ? "red"
    : isExpired
      ? "orange"
      : data.status?.color;

  return (
    <>
      <PageHeader
        back
        title={data.policyNumber || "Policy"}
        description={`Logged ${formatDate(data.createdAt)}`}
        breadcrumbs={[
          { label: "Fleet" },
          { label: "Insurance", to: "/insurance" },
          { label: data.policyNumber || "Policy" },
        ]}
        actions={
          <>
            <EditInsuranceModalButton insurance={data} variant="button" />

            <DeleteInsuranceButton
              insuranceId={data._id}
              redirect
              variant="button"
            />
          </>
        }
      />

      <Stack gap="md">
        <DetailHero
          railColor={railColor}
          title={
            <Text fz="xl" fw={700} tt="uppercase">
              {data.policyNumber || "Policy"}
            </Text>
          }
          badges={
            <>
              <PicklistBadge item={data.status} size="md" />

              {isCancelled ? (
                <Badge
                  color="red"
                  size="md"
                  leftSection={<IconBan size={12} />}
                >
                  Cancelled
                </Badge>
              ) : (
                isExpired && (
                  <Tooltip label="Cover period has ended" withArrow>
                    <Badge
                      variant="outline"
                      color="orange"
                      size="md"
                      leftSection={<IconAlertTriangle size={12} />}
                    >
                      Expired
                    </Badge>
                  </Tooltip>
                )
              )}
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
          figureLabel="Payable"
          figure={formatAmount(payable)}
          figureHint={`Logged ${formatDate(data.createdAt)}`}
        />

        <SimpleGrid cols={{ base: 2, lg: 4 }} spacing="md">
          <StatTile
            icon={IconUmbrella}
            label="Coverage"
            value={formatAmount(coverageLimit)}
            hint={
              coverages.length
                ? `${coverages.length} coverages`
                : "Single limit"
            }
            color="grape"
          />

          <StatTile
            icon={IconCash}
            label="Premium"
            value={formatAmount(premium)}
            hint={
              data.taxAmount
                ? `+ tax ${formatAmount(data.taxAmount)}`
                : "Before tax"
            }
            color="teal"
          />

          <StatTile
            icon={IconShieldHalf}
            label="Deductible"
            value={
              data.deductible != null ? formatAmount(data.deductible) : "—"
            }
            hint="Paid per claim"
          />

          <StatTile
            icon={IconCalendarEvent}
            label={isCancelled ? "Status" : "Days left"}
            value={
              isCancelled
                ? "Cancelled"
                : daysLeft != null
                  ? `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`
                  : "—"
            }
            hint={
              data.endDate ? `Ends ${formatDate(data.endDate)}` : "No end date"
            }
            color={isCancelled || isExpired ? "red" : "orange"}
          />
        </SimpleGrid>

        <Grid>
          {/* left: term, coverages, money, timeline */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="md">
              <DetailPanel
                title="Policy term"
                icon={IconShieldCheck}
                action={
                  <Text size="xs" c="dimmed">
                    {termDays != null ? `${termDays} day term` : "Open term"}
                  </Text>
                }
              >
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md" mb="md">
                  <Field label="Starts" numeric>
                    {data.startDate ? formatDate(data.startDate) : "—"}
                  </Field>

                  <Field label="Ends" numeric>
                    {data.endDate ? formatDate(data.endDate) : "—"}
                  </Field>

                  <Field label="Provider">
                    <PicklistBadge item={data.provider} />
                  </Field>
                </SimpleGrid>

                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">
                    Term elapsed
                  </Text>

                  <Text size="xs" fw={600}>
                    {elapsedShare}%
                  </Text>
                </Group>

                <Progress
                  value={elapsedShare}
                  size="sm"
                  radius="xl"
                  color={isExpired || isCancelled ? "red" : "brand"}
                />
              </DetailPanel>

              <DetailPanel
                title="Coverage"
                icon={IconUmbrella}
                action={
                  <Badge size="lg" className="numeric">
                    {formatAmount(coverageLimit)}
                  </Badge>
                }
              >
                {coverages.length ? (
                  <Table.ScrollContainer minWidth={460}>
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

                            <Table.Td ta="right">
                              {formatAmount(row.limit || 0)}
                            </Table.Td>

                            <Table.Td ta="right">
                              {formatAmount(row.deductible || 0)}
                            </Table.Td>

                            <Table.Td ta="right">
                              <Text size="sm" fw={600}>
                                {formatAmount(row.premium || 0)}
                              </Text>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                ) : (
                  <SimpleGrid cols={2} spacing="md">
                    <Field label="Coverage limit" numeric>
                      {formatAmount(data.coverage || 0)}
                    </Field>

                    <Field label="Breakdown">
                      <Text size="sm" c="dimmed">
                        No coverage lines
                      </Text>
                    </Field>
                  </SimpleGrid>
                )}
              </DetailPanel>

              <DetailPanel title="Amounts" icon={IconCash}>
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                  <Field label="Premium" numeric>
                    {formatAmount(premium)}
                  </Field>

                  <Field label="Tax" numeric>
                    {data.taxAmount != null
                      ? formatAmount(data.taxAmount)
                      : "—"}
                  </Field>

                  <Field label="Discount" numeric>
                    {data.discountAmount != null
                      ? `− ${formatAmount(data.discountAmount)}`
                      : "—"}
                  </Field>

                  <Field label="Total payable">
                    <Text size="sm" fw={700} className="numeric">
                      {formatAmount(payable)}
                    </Text>
                  </Field>
                </SimpleGrid>
              </DetailPanel>

              <DetailPanel title="Policy timeline" icon={IconCalendarEvent}>
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

                        {item.key === "cancelled" &&
                          data.cancellationReason && (
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
              </DetailPanel>
            </Stack>
          </Grid.Col>

          {/* right: parties, notes, record */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="md">
              <DetailPanel title="Parties" icon={IconBuildingBank}>
                <DetailPanel.FieldList>
                  <Field label="Provider">
                    <PicklistBadge item={data.provider} />
                  </Field>

                  <Field label="Broker">
                    <PicklistBadge item={data.broker} fallback="No broker" />
                  </Field>

                  <Field label="Policy type">
                    <PicklistBadge item={data.type} />
                  </Field>

                  <Field label="Company">
                    {title(data.company) ||
                      (data.company ? "Not populated" : "—")}
                  </Field>
                </DetailPanel.FieldList>
              </DetailPanel>

              <DetailPanel title="Notes" icon={IconFileDescription}>
                <Text size="sm">{data.notes || "No additional notes"}</Text>
              </DetailPanel>

              <DetailPanel title="Record" icon={IconCalendarEvent}>
                <DetailPanel.FieldList>
                  <Field label="Created on" numeric>
                    {formatDate(data.createdAt)}
                  </Field>

                  <Field label="Last updated" numeric>
                    {formatDate(data.updatedAt)}
                  </Field>
                </DetailPanel.FieldList>
              </DetailPanel>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
};

export default InsuranceDetails;
