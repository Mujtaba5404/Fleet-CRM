import {
  Alert,
  Avatar,
  Badge,
  Center,
  Group,
  Loader,
  Text,
} from "@mantine/core";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useGetfleetByIdQuery } from "../../api/fleet";
import DetailLayout from "../../components/DetailLayout";
import KeyFacts from "../../components/KeyFacts";
import Placeholder from "../../components/Placeholder";
import PropertyCard from "../../components/PropertyCard";
import RecordHeader from "../../components/RecordHeader";
import RecordMeta from "../../components/RecordMeta";
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
  const distanceDriven =
    (data.currentOdometer ?? 0) - (data.initialOdometer ?? 0);

  // Only an assigned vehicle carries driver details.
  // The person is sent as `user`; older records stored it as `driver`.
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
          <Group gap={8} wrap="wrap">
            <Badge size="md" variant="default" radius="sm" tt="uppercase">
              {data.licensePlate || "No plate"}
            </Badge>

            <Text fz="sm" c="dimmed" tt="capitalize">
              {[data.year, data.color, picklistTitle(data.type)]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </Group>
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

      <DetailLayout
        asideFirst
        main={<VehicleRecords fleet={data} />}
        aside={
          <PropertyCard
            sections={[
              {
                title: "Specification",
                items: [
                  {
                    label: "Make",
                    value: picklistTitle(data.make),
                    tt: "capitalize",
                  },
                  {
                    label: "Model",
                    value: picklistTitle(data.model),
                    tt: "capitalize",
                  },
                  { label: "Year", value: data.year, numeric: true },
                  {
                    label: "Type",
                    value: picklistTitle(data.type),
                    tt: "capitalize",
                  },
                  {
                    label: "Fuel type",
                    value: picklistTitle(data.fuelType),
                    tt: "capitalize",
                  },
                  {
                    label: "Transmission",
                    value: picklistTitle(data.transmission),
                    tt: "capitalize",
                  },
                  {
                    label: "Condition",
                    value: picklistTitle(data.condition),
                    tt: "capitalize",
                  },
                  { label: "Colour", value: data.color, tt: "capitalize" },
                ],
              },
              {
                title: "Odometer",
                items: [
                  {
                    label: "Initial reading",
                    value: data.initialOdometer?.toLocaleString(),
                    numeric: true,
                  },
                ],
              },
              {
                title: "Driver",
                items: [
                  {
                    label: "License number",
                    value: driver?.licenseNumber,
                    numeric: true,
                  },
                  {
                    label: "License expiry",
                    value: driver?.licenseExpiry && (
                      <Text
                        fz="sm"
                        fw={500}
                        c={licenseExpired ? "red" : undefined}
                        className="numeric"
                      >
                        {formatDate(driver.licenseExpiry)}
                      </Text>
                    ),
                  },
                  {
                    label: "Inspector",
                    value: data.inspector?.name,
                    tt: "capitalize",
                  },
                ],
              },
            ]}
            footer={
              <RecordMeta
                company={data.company}
                createdAt={data.createdAt}
                updatedAt={data.updatedAt}
              />
            }
          />
        }
      />
    </>
  );
};

export default FleetDetails;
