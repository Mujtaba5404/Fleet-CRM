import {
  Avatar,
  Badge,
  Center,
  Grid,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconCar,
  IconCash,
  IconEngine,
  IconGasStation,
  IconGauge,
  IconPaint,
  IconProgressCheck,
  IconRoad,
  IconSparkles,
  IconUserCheck,
  IconX,
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useGetfleetByIdQuery } from "../../api/fleet";
import DetailHero from "../../components/DetailHero";
import DetailPanel from "../../components/DetailPanel";
import PageHeader from "../../components/PageHeader";
import PicklistBadge from "../../components/PicklistBadge";
import Placeholder from "../../components/Placeholder";
import StatTile from "../../components/StatTile";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import getAbbreviation from "../../utils/getAbbreviation";
import DeletefleetButton from "./DeletefleetButton";
import EditfleetModalButton from "./EditfleetModalButton";

const SPEC_FIELDS = [
  { icon: IconCar, label: "Type", key: "type" },
  { icon: IconGasStation, label: "Fuel type", key: "fuelType" },
  { icon: IconEngine, label: "Transmission", key: "transmission" },
  { icon: IconProgressCheck, label: "Status", key: "status" },
  { icon: IconSparkles, label: "Condition", key: "condition" },
];

const FleetDetails = () => {
  const { id } = useParams();

  const fleet = useGetfleetByIdQuery(id);

  if (fleet.isLoading)
    return (
      <Center h={320}>
        <Loader />
      </Center>
    );

  if (fleet.isError)
    return (
      <>
        <PageHeader
          back
          title="Vehicle"
          breadcrumbs={[
            { label: "Fleet" },
            { label: "Vehicles", to: "/fleets" },
          ]}
        />

        <Placeholder
          title={
            fleet.error?.response?.data?.message ||
            fleet.error?.message ||
            "Error"
          }
          description="We could not load this vehicle. It may have been deleted."
          icon={<IconX size={32} />}
        />
      </>
    );

  const data = fleet.data;

  const vehicleName = [data.make?.title, data.model?.title]
    .filter(Boolean)
    .join(" ");
  const distanceDriven =
    (data.currentOdometer ?? 0) - (data.initialOdometer ?? 0);

  return (
    <>
      <PageHeader
        back
        title={vehicleName || data.licensePlate || "Vehicle"}
        description={`Added ${formatDate(data.createdAt)}`}
        breadcrumbs={[
          { label: "Fleet" },
          { label: "Vehicles", to: "/fleets" },
          { label: data.licensePlate || "Vehicle" },
        ]}
        actions={
          <>
            <EditfleetModalButton fleet={data} variant="button" />

            <DeletefleetButton fleetId={data._id} redirect variant="button" />
          </>
        }
      />

      <Stack gap="md">
        <DetailHero
          railColor={data.status?.color}
          title={
            <Group gap="sm" wrap="nowrap">
              <Avatar
                alt={vehicleName}
                size={44}
                radius="md"
                color={data.make?.color || "gray"}
              >
                {getAbbreviation(vehicleName || data.licensePlate)}
              </Avatar>

              <Text fz="xl" fw={700} tt="capitalize">
                {vehicleName || "—"}
              </Text>
            </Group>
          }
          badges={
            <>
              <Badge size="md" tt="uppercase">
                {data.licensePlate || "—"}
              </Badge>

              <PicklistBadge item={data.status} size="md" />
              <PicklistBadge item={data.condition} size="md" />
            </>
          }
          subtitle={
            <Group gap="xs">
              <Text fz="sm" c="dimmed" tt="capitalize">
                {[data.year, data.color, data.type?.title]
                  .filter(Boolean)
                  .join(" · ") || "No specification recorded"}
              </Text>
            </Group>
          }
          figureLabel="Purchase price"
          figure={formatAmount(data.purchaseAmount || 0)}
          figureHint={
            data.purchaseDate
              ? `Bought ${formatDate(data.purchaseDate)}`
              : "No purchase date"
          }
        />

        <SimpleGrid cols={{ base: 2, lg: 4 }} spacing="md">
          <StatTile
            label="Current odometer"
            value={data.currentOdometer?.toLocaleString() ?? "—"}
            hint="Latest reading"
            icon={IconGauge}
          />

          <StatTile
            label="Distance driven"
            value={distanceDriven.toLocaleString()}
            hint={`From ${data.initialOdometer?.toLocaleString() ?? "—"}`}
            icon={IconRoad}
            color="cyan"
          />

          <StatTile
            label="Monthly rent"
            value={data.rent ? formatAmount(data.rent) : "—"}
            hint={data.rent ? "Recurring" : "Not rented out"}
            icon={IconCash}
            color="teal"
          />

          <StatTile
            label="Assigned"
            value={data.assignedOn ? formatDate(data.assignedOn) : "—"}
            hint={data.assignedTo?.name || "Unassigned"}
            icon={IconUserCheck}
            color="grape"
          />
        </SimpleGrid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
            <DetailPanel title="Specification" icon={IconCar} h="100%">
              <DetailPanel.FieldList>
                {SPEC_FIELDS.map(({ icon: Icon, label, key }) => (
                  <Group key={key} justify="space-between" wrap="nowrap">
                    <Group gap={8} wrap="nowrap">
                      <Icon size={16} color="var(--mantine-color-dimmed)" />

                      <Text fz="sm" c="dimmed">
                        {label}
                      </Text>
                    </Group>

                    <PicklistBadge item={data[key]} />
                  </Group>
                ))}

                <Group justify="space-between" wrap="nowrap">
                  <Group gap={8} wrap="nowrap">
                    <IconPaint size={16} color="var(--mantine-color-dimmed)" />

                    <Text fz="sm" c="dimmed">
                      Colour
                    </Text>
                  </Group>

                  <Text fz="sm" fw={500} tt="capitalize">
                    {data.color || "—"}
                  </Text>
                </Group>
              </DetailPanel.FieldList>
            </DetailPanel>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
            <Stack gap="md">
              <DetailPanel title="Purchase & rent" icon={IconCash}>
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                  <DetailPanel.Field label="Purchase amount" numeric>
                    {formatAmount(data.purchaseAmount || 0)}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Purchase date" numeric>
                    {formatDate(data.purchaseDate)}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Monthly rent" numeric>
                    {data.rent ? formatAmount(data.rent) : "—"}
                  </DetailPanel.Field>
                </SimpleGrid>
              </DetailPanel>

              <DetailPanel title="Odometer" icon={IconGauge}>
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                  <DetailPanel.Field label="Current reading" numeric>
                    {data.currentOdometer?.toLocaleString() ?? "—"}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Initial reading" numeric>
                    {data.initialOdometer?.toLocaleString() ?? "—"}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Distance driven" numeric>
                    {distanceDriven.toLocaleString()}
                  </DetailPanel.Field>
                </SimpleGrid>
              </DetailPanel>

              <DetailPanel title="Assignment" icon={IconUserCheck}>
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                  <DetailPanel.Field label="Assigned to">
                    {data.assignedTo?.name ||
                      (data.assignedTo ? "Not populated" : "Unassigned")}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Assigned on" numeric>
                    {data.assignedOn ? formatDate(data.assignedOn) : "—"}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Inspector">
                    {data.inspector?.name ||
                      (data.inspector ? "Not populated" : "—")}
                  </DetailPanel.Field>
                </SimpleGrid>
              </DetailPanel>

              <DetailPanel title="Record" icon={IconCalendarEvent}>
                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                  <DetailPanel.Field label="Company">
                    {data.company?.title ||
                      (data.company ? "Not populated" : "—")}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Created on" numeric>
                    {formatDate(data.createdAt)}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Last updated" numeric>
                    {formatDate(data.updatedAt)}
                  </DetailPanel.Field>
                </SimpleGrid>
              </DetailPanel>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
};

export default FleetDetails;
