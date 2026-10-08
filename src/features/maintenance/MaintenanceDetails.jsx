import {
  Badge,
  Center,
  Group,
  Loader,
  Stack,
  Stepper,
  Table,
  Text,
  useMatches,
} from "@mantine/core";
import {
  IconCalendarCheck,
  IconFlag,
  IconPlayerPlay,
  IconUserCheck,
  IconX,
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useGetMaintenanceByIdQuery } from "../../api/maintenance";
import DetailLayout from "../../components/DetailLayout";
import DetailPanel from "../../components/DetailPanel";
import KeyFacts from "../../components/KeyFacts";
import PicklistBadge from "../../components/PicklistBadge";
import Placeholder from "../../components/Placeholder";
import PropertyCard from "../../components/PropertyCard";
import RecordHeader from "../../components/RecordHeader";
import RecordMeta from "../../components/RecordMeta";
import daysBetween from "../../utils/daysBetween";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import picklistTitle from "../../utils/picklistTitle";
import VehicleLink from "../fleets/VehicleLink";
import CompleteMaintenanceButton from "./CompleteMaintenanceButton";
import ConditionGallery from "./ConditionGallery";
import DeleteMaintenanceButton from "./DeleteMaintenanceButton";
import EditMaintenanceModalButton from "./EditMaintenanceModalButton";
import { isCompleted } from "./maintenanceForm";
import MaintenanceStatusBadge from "./MaintenanceStatusBadge";

const BREADCRUMBS = [
  { label: "Fleet" },
  { label: "Maintenance", to: "/maintenance" },
];

/** Reported → assigned → started → completed, with whatever dates exist. */
const JobProgress = ({ job }) => {
  const orientation = useMatches({ base: "vertical", sm: "horizontal" });

  const steps = [
    { label: "Reported", date: job.createdAt, icon: IconFlag },
    { label: "Assigned", date: job.assignedOn, icon: IconUserCheck },
    { label: "Work started", date: job.startDate, icon: IconPlayerPlay },
    { label: "Completed", date: job.endDate, icon: IconCalendarCheck },
  ];

  // Everything up to the latest recorded step counts as done, even when an
  // earlier step was never dated.
  const reached = steps.findLastIndex((step) => step.date) + 1;
  const active = isCompleted(job.status) ? steps.length : reached;

  return (
    <Stepper active={active} orientation={orientation} size="sm">
      {steps.map(({ label, date, icon: Icon }, index) => (
        <Stepper.Step
          key={label}
          label={label}
          icon={<Icon size={16} />}
          description={
            date
              ? formatDate(date)
              : index < active
                ? "Not recorded"
                : "Pending"
          }
        />
      ))}
    </Stepper>
  );
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
        <RecordHeader title="Maintenance" breadcrumbs={BREADCRUMBS} />

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
  const checklist = data.checklist || [];
  const photosBefore = data.conditionBefore || [];
  const photosAfter = data.conditionAfter || [];
  const photoCount = photosBefore.length + photosAfter.length;

  const duration = daysBetween(data.startDate, data.endDate);
  const daysOpen = data.startDate
    ? daysBetween(data.startDate, new Date())
    : null;

  return (
    <>
      <RecordHeader
        title={data.type?.title || "Maintenance job"}
        breadcrumbs={[
          ...BREADCRUMBS,
          { label: data.fleet?.licensePlate || data.type?.title || "Job" },
        ]}
        badges={
          <>
            <MaintenanceStatusBadge status={data.status} size="md" />

            {data.priority?.title && (
              <Badge
                size="md"
                variant="outline"
                color={data.priority.color || "gray"}
                tt="capitalize"
              >
                {data.priority.title} priority
              </Badge>
            )}
          </>
        }
        meta={<VehicleLink fleet={data.fleet} />}
        actions={
          <>
            <CompleteMaintenanceButton maintenance={data} />

            <EditMaintenanceModalButton maintenance={data} variant="button" />

            <DeleteMaintenanceButton
              maintenanceId={data._id}
              redirect
              variant="button"
            />
          </>
        }
      />

      <KeyFacts
        items={[
          {
            label: "Total cost",
            value: formatAmount(data.cost || 0),
          },
          {
            label: "Odometer",
            value: data.odometer != null ? data.odometer.toLocaleString() : "—",
            hint: "At service",
          },
          {
            label: "Duration",
            value:
              duration != null
                ? `${duration} ${duration === 1 ? "day" : "days"}`
                : "Open",
            hint:
              duration != null
                ? "Start to completion"
                : daysOpen != null
                  ? `In progress for ${daysOpen} ${daysOpen === 1 ? "day" : "days"}`
                  : "Not started",
          },
          {
            label: "Assigned to",
            value: data.assignedTo?.name || "Unassigned",
          },
        ]}
      />

      <DetailLayout
        main={
          <Stack gap="md">
            <DetailPanel title="Progress">
              <JobProgress job={data} />
            </DetailPanel>

            <DetailPanel
              title="Inspection checklist"
              action={
                <Text fz="xs" c="dimmed">
                  {checklist.length} {checklist.length === 1 ? "item" : "items"}
                </Text>
              }
            >
              {checklist.length ? (
                <Table.ScrollContainer minWidth={420}>
                  <Table verticalSpacing="xs" highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Item</Table.Th>
                        <Table.Th>Condition</Table.Th>
                        <Table.Th ta="right">Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {checklist.map((row, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>
                            <Text fz="sm" fw={500} tt="capitalize">
                              {row.item?.title || "—"}
                            </Text>
                          </Table.Td>

                          <Table.Td>
                            <Text fz="sm" c="dimmed" tt="capitalize">
                              {picklistTitle(row.condition) || "—"}
                            </Text>
                          </Table.Td>

                          <Table.Td>
                            <Group justify="flex-end">
                              <PicklistBadge item={row.status} />
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              ) : (
                <Text fz="sm" c="dimmed">
                  Nothing inspected.
                </Text>
              )}
            </DetailPanel>

            <DetailPanel
              title="Vehicle condition"
              action={
                <Text fz="xs" c="dimmed">
                  {photoCount} {photoCount === 1 ? "photo" : "photos"}
                </Text>
              }
            >
              <ConditionGallery
                before={photosBefore}
                after={photosAfter}
                completed={isCompleted(data.status)}
              />
            </DetailPanel>
          </Stack>
        }
        aside={
          <PropertyCard
            sections={[
              {
                title: "Details",
                items: [
                  {
                    label: "Vendor",
                    value: picklistTitle(data.vendor),
                    tt: "capitalize",
                  },
                  {
                    label: "Reported by",
                    value: data.reportedBy?.name,
                    tt: "capitalize",
                  },
                ],
              },
              {
                title: "Notes",
                content: (
                  <Text
                    fz="sm"
                    c={data.notes ? undefined : "dimmed"}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {data.notes || "No notes added."}
                  </Text>
                ),
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

export default MaintenanceDetails;
