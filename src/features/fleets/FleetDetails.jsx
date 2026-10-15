import {
  Alert,
  Avatar,
  Center,
  Group,
  Loader,
  Text
} from "@mantine/core";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { useGetfleetByIdQuery } from "../../api/fleet";
import KeyFacts from "../../components/KeyFacts";
import Placeholder from "../../components/Placeholder";
import RecordHeader from "../../components/RecordHeader";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import getAbbreviation from "../../utils/getAbbreviation";
import picklistTitle from "../../utils/picklistTitle";
import DeletefleetButton from "./DeletefleetButton";
import EditfleetModalButton from "./EditfleetModalButton";
import FleetStatusBadge from "./FleetStatusBadge";
import VehicleRecords from "./VehicleRecords";

const BREADCRUMBS = [{ label: "Fleet" }, { label: "Vehicles", to: "/fleets" }];

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
        <RecordHeader title="Vehicle" breadcrumbs={BREADCRUMBS} />

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
  // Make and model are the title; the rest of the spec reads as one line under it.
  const spec = [
    { label: "Year", value: data.year },
    { label: "Type", value: picklistTitle(data.type) },
    { label: "Fuel type", value: picklistTitle(data.fuelType) },
    { label: "Transmission", value: picklistTitle(data.transmission) },
    { label: "Condition", value: picklistTitle(data.condition) },
    { label: "Colour", value: data.color },
  ].filter(({ value }) => value != null && value !== "");

  const distanceDriven =
    (data.currentOdometer ?? 0) - (data.initialOdometer ?? 0);

  const driverUser = data.driverDetails?.user ?? data.driverDetails?.driver;
  const driver = driverUser ? data.driverDetails : null;
  const driverName = typeof driverUser === "object" ? driverUser?.name : null;
  const licenseExpired =
    !!driver?.licenseExpiry &&
    dayjs(driver.licenseExpiry).isBefore(dayjs(), "day");

  return (
    <>
      <RecordHeader
        title={vehicleName || data.licensePlate || "Vehicle"}
        breadcrumbs={[
          ...BREADCRUMBS,
          { label: data.licensePlate || "Vehicle" },
        ]}
        avatar={
          <Avatar
            alt={vehicleName}
            size={48}
            radius="md"
            color={data.make?.color || "brand"}
            visibleFrom="xs"
          >
            {getAbbreviation(vehicleName || data.licensePlate)}
          </Avatar>
        }
        badges={
          data.status && <FleetStatusBadge status={data.status} size="md" />
        }
        meta={
          spec.length > 0 && (
            <Group gap={6} wrap="wrap" fz="sm" c="dimmed">
              {spec.map(({ label, value }, index) => (
                <Fragment key={label}>
                  {index > 0 && <Text span inherit aria-hidden>·</Text>}
                  <Text span inherit tt="capitalize" title={label}>
                    {value}
                  </Text>
                </Fragment>
              ))}
            </Group>
          )
        }
        actions={
          <>
            <EditfleetModalButton fleet={data} variant="button" />

            <DeletefleetButton fleetId={data._id} redirect variant="button" />
          </>
        }
      />

      {licenseExpired && (
        <Alert
          color="red"
          icon={<IconAlertTriangle size={18} />}
          title="Driver's license has expired"
          mb="md"
        >
          {`${driverName || "The assigned driver"}'s license expired on ${formatDate(driver.licenseExpiry)}.`}
        </Alert>
      )}

      <KeyFacts
        items={[
          {
            label: "Odometer",
            value: data.currentOdometer?.toLocaleString() ?? "—",
            hint: `${distanceDriven.toLocaleString()} driven since added`,
          },
          {
            label: "Monthly rent",
            value: data.rent ? formatAmount(data.rent) : "—",
            hint: data.rent ? "Recurring" : "Not rented out",
          },
          {
            label: "Purchase price",
            value: data.purchaseAmount
              ? formatAmount(data.purchaseAmount)
              : "—",
            hint: data.purchaseDate
              ? `Bought ${formatDate(data.purchaseDate)}`
              : "No purchase date",
          },
          {
            label: "Driver",
            value: driverName || (driver ? "Assigned" : "Unassigned"),
            hint: licenseExpired
              ? "License expired"
              : data.assignedOn
                ? `Since ${formatDate(data.assignedOn)}`
                : "No driver assigned",
            hintColor: licenseExpired ? "red" : undefined,
          },
        ]}
      />

      <VehicleRecords fleet={data} />
    </>
  );
};

export default FleetDetails;
