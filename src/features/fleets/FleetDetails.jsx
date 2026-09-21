import { Avatar, Badge, Grid, Group, Loader, Paper, SimpleGrid, Stack, Text, Tooltip } from "@mantine/core";
import {
  IconCalendarEvent,
  IconCar,
  IconCash,
  IconEngine,
  IconGasStation,
  IconGauge,
  IconPaint,
  IconProgressCheck,
  IconSparkles,
  IconUserCheck,
  IconX,
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useGetfleetByIdQuery } from "../../api/fleet";
import InfoList from "../../components/InfoList";
import Placeholder from "../../components/Placeholder";
import classes from "../../index.module.css";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import getAbbreviation from "../../utils/getAbbreviation";
import DeletefleetButton from "./DeletefleetButton";
import EditfleetModalButton from "./EditfleetModalButton";

const PicklistBadge = ({ item }) => {
  if (!item?.title)
    return (
      <Text size="sm" c={"dimmed"}>
        —
      </Text>
    );

  return (
    <Badge variant="light" size="sm" color={item.color || "gray"} tt={"capitalize"}>
      {item.title}
    </Badge>
  );
};

const Field = ({ label, children }) => (
  <Stack gap={2}>
    <Text size="xs" c={"dimmed"} fw={500}>
      {label}
    </Text>

    {typeof children === "string" || typeof children === "number" ? (
      <Text size="sm" fw={500}>
        {children}
      </Text>
    ) : (
      children
    )}
  </Stack>
);

const Section = ({ icon, title, children }) => (
  <Paper p={"md"}>
    <Group gap={8} align="flex-end" mb={"md"}>
      {icon}

      <Text size="xs" c={"dimmed"} fw={500}>
        {title}
      </Text>
    </Group>

    {children}
  </Paper>
);

const createInfoListItems = (fleet) => [
  { icon: <IconCar />, label: "type", children: <PicklistBadge item={fleet.type} /> },
  { icon: <IconGasStation />, label: "fuel type", children: <PicklistBadge item={fleet.fuelType} /> },
  { icon: <IconEngine />, label: "transmission", children: <PicklistBadge item={fleet.transmission} /> },
  { icon: <IconProgressCheck />, label: "status", children: <PicklistBadge item={fleet.status} /> },
  { icon: <IconSparkles />, label: "condition", children: <PicklistBadge item={fleet.condition} /> },
  {
    icon: <IconPaint />,
    label: "color",
    children: (
      <Text size="sm" tt={"capitalize"}>
        {fleet.color || "—"}
      </Text>
    ),
  },
];

const FleetDetails = () => {
  const { id } = useParams();

  const fleet = useGetfleetByIdQuery(id);

  if (fleet.isLoading) return <Loader />;

  if (fleet.isError) return <Placeholder title={fleet.error?.response?.data.message || "Error"} icon={<IconX size={50} />} />;

  const data = fleet.data;

  const infoList = createInfoListItems(data);

  const vehicleName = [data.make?.title, data.model?.title].filter(Boolean).join(" ");
  const distanceDriven = (data.currentOdometer ?? 0) - (data.initialOdometer ?? 0);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 4, xl: 3 }}>
        <Stack>
          <Group>
            <Avatar alt={vehicleName} size={"xl"} color={data.make?.color || "gray"}>
              {getAbbreviation(vehicleName || data.licensePlate)}
            </Avatar>

            <Stack gap={4}>
              <Group gap={"xs"}>
                <Tooltip label={vehicleName || "—"}>
                  <Text size="lg" fw={700} tt={"capitalize"}>
                    {vehicleName || "—"}
                  </Text>
                </Tooltip>

                <EditfleetModalButton fleet={data} />

                <DeletefleetButton fleetId={data._id} redirect />
              </Group>

              <Group gap={6} mt={4}>
                <Badge variant="light" tt={"uppercase"}>
                  {data.licensePlate || "—"}
                </Badge>

                <Text size="xs" c={"dimmed"} fw={500}>
                  {data.year || "—"}
                </Text>
              </Group>

              <Text size="xs" fw={500}>
                <Text component="span" c={"dimmed"}>
                  Added on:
                </Text>
                {` ${formatDate(data.createdAt)}`}
              </Text>
            </Stack>
          </Group>

          <InfoList>
            {infoList.map((item, index) => (
              <InfoList.Item key={index} icon={item.icon} label={item.label}>
                {item.children}
              </InfoList.Item>
            ))}
          </InfoList>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 8, xl: 9 }}>
        <Stack>
          <Section icon={<IconCash className={classes.icon} />} title="Purchase & rent">
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing={"md"}>
              <Field label="Purchase amount">{formatAmount(data.purchaseAmount || 0)}</Field>

              <Field label="Purchase date">{formatDate(data.purchaseDate)}</Field>

              <Field label="Monthly rent">{data.rent ? formatAmount(data.rent) : "—"}</Field>
            </SimpleGrid>
          </Section>

          <Section icon={<IconGauge className={classes.icon} />} title="Odometer">
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing={"md"}>
              <Field label="Current reading">{data.currentOdometer?.toLocaleString() ?? "—"}</Field>

              <Field label="Initial reading">{data.initialOdometer?.toLocaleString() ?? "—"}</Field>

              <Field label="Distance driven">{distanceDriven.toLocaleString()}</Field>
            </SimpleGrid>
          </Section>

          <Section icon={<IconUserCheck className={classes.icon} />} title="Assignment">
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing={"md"}>
              <Field label="Assigned to">{data.assignedTo?.name || (data.assignedTo ? "Not populated" : "Unassigned")}</Field>

              <Field label="Assigned on">{data.assignedOn ? formatDate(data.assignedOn) : "—"}</Field>

              <Field label="Inspector">{data.inspector?.name || (data.inspector ? "Not populated" : "—")}</Field>
            </SimpleGrid>
          </Section>

          <Section icon={<IconCalendarEvent className={classes.icon} />} title="Record">
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing={"md"}>
              <Field label="Company">{data.company?.title || (data.company ? "Not populated" : "—")}</Field>

              <Field label="Created on">{formatDate(data.createdAt)}</Field>

              <Field label="Last updated">{formatDate(data.updatedAt)}</Field>
            </SimpleGrid>
          </Section>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default FleetDetails;