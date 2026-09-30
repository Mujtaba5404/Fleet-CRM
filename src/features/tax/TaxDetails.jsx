import {
  Badge,
  Center,
  Grid,
  Group,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconBuildingBank,
  IconCalendarEvent,
  IconCalendarOff,
  IconCash,
  IconFileDescription,
  IconLicense,
  IconMapPin,
  IconPlayerPlay,
  IconReceipt,
  IconReceiptTax,
  IconX,
} from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useGetTaxByIdQuery } from "../../api/tax";
import DetailHero from "../../components/DetailHero";
import DetailPanel from "../../components/DetailPanel";
import PageHeader from "../../components/PageHeader";
import PicklistBadge from "../../components/PicklistBadge";
import Placeholder from "../../components/Placeholder";
import StatTile from "../../components/StatTile";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import DeleteTaxButton from "./DeleteTaxButton";
import EditTaxModalButton from "./EditTaxModalButton";

const Field = DetailPanel.Field;

const title = (value) =>
  typeof value === "object" && value?.title ? value.title : null;

const daysBetween = (from, to) => {
  if (!from || !to) return null;

  return Math.max(0, Math.round((new Date(to) - new Date(from)) / 86400000));
};

const TaxDetails = () => {
  const { id } = useParams();

  const tax = useGetTaxByIdQuery(id);

  if (tax.isLoading)
    return (
      <Center h={320}>
        <Loader />
      </Center>
    );

  if (tax.isError)
    return (
      <>
        <PageHeader
          back
          title="Tax record"
          breadcrumbs={[{ label: "Fleet" }, { label: "Tax", to: "/tax" }]}
        />

        <Placeholder
          title={
            tax.error?.response?.data?.message || tax.error?.message || "Error"
          }
          description="We could not load this tax record. It may have been deleted."
          icon={<IconX size={32} />}
        />
      </>
    );

  const data = tax.data;
  const fleet = data.fleet;

  const isFiled = Boolean(data.filingDate);
  const isLapsed = data.endDate && new Date(data.endDate) < new Date();
  const periodDays = daysBetween(data.startDate, data.endDate);
  const daysLeft = data.endDate ? daysBetween(new Date(), data.endDate) : null;
  const elapsedShare = periodDays
    ? Math.min(
        100,
        Math.round(((periodDays - (daysLeft ?? 0)) / periodDays) * 100),
      )
    : 0;

  // How long after the period ended the filing actually happened.
  const filingDelay =
    isFiled && data.endDate ? daysBetween(data.endDate, data.filingDate) : null;

  const timelineItems = [
    {
      key: "start",
      label: "Period starts",
      date: data.startDate,
      icon: <IconPlayerPlay size={12} />,
    },
    {
      key: "end",
      label: "Period ends",
      date: data.endDate,
      icon: <IconCalendarOff size={12} />,
    },
    {
      key: "created",
      label: "Record logged",
      date: data.createdAt,
      icon: <IconFileDescription size={12} />,
    },
    {
      key: "filed",
      label: "Filed",
      date: data.filingDate,
      icon: <IconReceipt size={12} />,
    },
  ]
    .filter((item) => item.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // An unfiled challan is the thing worth flagging, then a lapsed period.
  const railColor = !isFiled ? "orange" : isLapsed ? "red" : data.status?.color;

  return (
    <>
      <PageHeader
        back
        title={data.challanNumber || "Tax record"}
        description={`Logged ${formatDate(data.createdAt)}`}
        breadcrumbs={[
          { label: "Fleet" },
          { label: "Tax", to: "/tax" },
          { label: data.challanNumber || "Tax record" },
        ]}
        actions={
          <>
            <EditTaxModalButton tax={data} variant="button" />

            <DeleteTaxButton taxId={data._id} redirect variant="button" />
          </>
        }
      />

      <Stack gap="md">
        <DetailHero
          railColor={railColor}
          title={
            <Text fz="xl" fw={700} tt="uppercase">
              {data.challanNumber || "Tax record"}
            </Text>
          }
          badges={
            <>
              <PicklistBadge item={data.status} size="md" />

              {isFiled ? (
                <Badge
                  color="green"
                  size="md"
                  leftSection={<IconReceipt size={12} />}
                >
                  Filed
                </Badge>
              ) : (
                <Tooltip label="No filing date recorded" withArrow>
                  <Badge
                    variant="outline"
                    color="orange"
                    size="md"
                    leftSection={<IconAlertTriangle size={12} />}
                  >
                    Not filed
                  </Badge>
                </Tooltip>
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
          figureLabel="Tax amount"
          figure={formatAmount(data.taxAmount || 0)}
          figureHint={`Logged ${formatDate(data.createdAt)}`}
        />

        <SimpleGrid cols={{ base: 2, lg: 4 }} spacing="md">
          <StatTile
            icon={IconReceiptTax}
            label="Tax amount"
            value={formatAmount(data.taxAmount || 0)}
            hint={title(data.status) || "No status"}
            color="grape"
          />

          <StatTile
            icon={IconMapPin}
            label="Jurisdiction"
            value={title(data.jurisdiction) || "—"}
            hint="Filing authority"
            color="teal"
          />

          <StatTile
            icon={IconCalendarEvent}
            label="Period"
            value={periodDays != null ? `${periodDays} days` : "Open"}
            hint={
              data.endDate ? `Ends ${formatDate(data.endDate)}` : "No end date"
            }
            color={isLapsed ? "red" : "brand"}
          />

          <StatTile
            icon={IconReceipt}
            label="Filing"
            value={isFiled ? formatDate(data.filingDate) : "Pending"}
            hint={
              filingDelay != null
                ? `${filingDelay} days after period end`
                : "Not filed yet"
            }
            color={isFiled ? "green" : "orange"}
          />
        </SimpleGrid>

        <Grid>
          {/* left: period, amount, timeline */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="md">
              <DetailPanel
                title="Tax period"
                icon={IconCalendarEvent}
                action={
                  <Text size="xs" c="dimmed">
                    {periodDays != null
                      ? `${periodDays} day period`
                      : "Open period"}
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

                  <Field label="Filed on" numeric>
                    {isFiled ? formatDate(data.filingDate) : "Not filed"}
                  </Field>
                </SimpleGrid>

                <Group justify="space-between" mb={4}>
                  <Text size="xs" c="dimmed">
                    Period elapsed
                  </Text>

                  <Text size="xs" fw={600}>
                    {elapsedShare}%
                  </Text>
                </Group>

                <Progress
                  value={elapsedShare}
                  size="sm"
                  radius="xl"
                  color={isLapsed ? "red" : "brand"}
                />
              </DetailPanel>

              <DetailPanel
                title="Amount"
                icon={IconCash}
                action={
                  <Badge size="lg" className="numeric">
                    {formatAmount(data.taxAmount || 0)}
                  </Badge>
                }
              >
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                  <Field label="Tax amount" numeric>
                    {formatAmount(data.taxAmount || 0)}
                  </Field>

                  <Field label="Status">
                    <PicklistBadge item={data.status} />
                  </Field>

                  <Field label="Challan number">
                    <Text size="sm" fw={600} tt="uppercase">
                      {data.challanNumber || "—"}
                    </Text>
                  </Field>
                </SimpleGrid>
              </DetailPanel>

              <DetailPanel title="Timeline" icon={IconFileDescription}>
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
            </Stack>
          </Grid.Col>

          {/* right: filing info, notes, record */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="md">
              <DetailPanel title="Filing" icon={IconBuildingBank}>
                <DetailPanel.FieldList>
                  <Field label="Jurisdiction">
                    <PicklistBadge item={data.jurisdiction} />
                  </Field>

                  <Field label="Status">
                    <PicklistBadge item={data.status} />
                  </Field>

                  <Field label="Company">
                    {title(data.company) ||
                      (data.company ? "Not populated" : "—")}
                  </Field>

                  <Field label="Vehicle">
                    {fleet ? (
                      <Text size="sm" fw={600} tt="uppercase">
                        {fleet.licensePlate || "—"}
                      </Text>
                    ) : (
                      "—"
                    )}
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

export default TaxDetails;
