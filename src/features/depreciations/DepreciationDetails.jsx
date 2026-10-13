import {
  Center,
  Group,
  Loader,
  Progress,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetDepreciationByIdQuery } from "../../api/depreciation";
import DetailLayout from "../../components/DetailLayout";
import DetailPanel from "../../components/DetailPanel";
import KeyFacts from "../../components/KeyFacts";
import Placeholder from "../../components/Placeholder";
import PropertyCard from "../../components/PropertyCard";
import RecordHeader from "../../components/RecordHeader";
import RecordMeta from "../../components/RecordMeta";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import VehicleLink from "../fleets/VehicleLink";
import DeleteDepreciationButton from "./DeleteDepreciationButton";
import { getDepreciationMethod } from "./depreciationForm";
import DepreciationMethodBadge from "./DepreciationMethodBadge";
import {
  buildMonthlySchedule,
  currentBookValue,
  depreciationEndDate,
  monthsElapsed,
  toYearlySchedule,
} from "./depreciationSchedule";
import EditDepreciationModalButton from "./EditDepreciationModalButton";

const BREADCRUMBS = [
  { label: "Fleet" },
  { label: "Depreciation", to: "/depreciations" },
];

const formatLife = (months) =>
  months ? `${months} ${months === 1 ? "month" : "months"}` : null;

const ScheduleTable = ({ years, elapsed }) => (
  <Table.ScrollContainer minWidth={560}>
    <Table
      verticalSpacing="xs"
      horizontalSpacing="sm"
      highlightOnHover
      className="numeric"
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Year</Table.Th>
          <Table.Th>Period</Table.Th>
          <Table.Th ta="right">Opening</Table.Th>
          <Table.Th ta="right">Depreciation</Table.Th>
          <Table.Th ta="right">Closing</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {years.map((row) => {
          const firstMonth = (row.year - 1) * 12 + 1;
          const isCurrent =
            elapsed >= firstMonth && elapsed < firstMonth + row.months;

          return (
            <Table.Tr
              key={row.year}
              bg={isCurrent ? "var(--mantine-primary-color-light)" : undefined}
            >
              <Table.Td fw={600}>Year {row.year}</Table.Td>
              <Table.Td c="dimmed" style={{ whiteSpace: "nowrap" }}>
                {row.from
                  ? `${formatDate(row.from, "MMM YYYY")} – ${formatDate(row.to, "MMM YYYY")}`
                  : `${row.months} months`}
              </Table.Td>
              <Table.Td ta="right">{formatAmount(row.opening)}</Table.Td>
              <Table.Td ta="right" c="red">
                −{formatAmount(row.depreciation)}
              </Table.Td>
              <Table.Td ta="right" fw={600}>
                {formatAmount(row.closing)}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
);

const DepreciationDetails = () => {
  const { id } = useParams();

  const depreciation = useGetDepreciationByIdQuery(id);
  const data = depreciation.data;

  const monthly = useMemo(
    () => (data ? buildMonthlySchedule(data) : []),
    [data],
  );
  const years = useMemo(() => toYearlySchedule(monthly), [monthly]);

  if (depreciation.isLoading)
    return (
      <Center h={320}>
        <Loader />
      </Center>
    );

  if (depreciation.isError || !data)
    return (
      <>
        <RecordHeader title="Depreciation" breadcrumbs={BREADCRUMBS} />

        <Placeholder
          title={
            depreciation.error?.response?.data?.message ||
            depreciation.error?.message ||
            "Error"
          }
          description="We could not load this depreciation. It may have been deleted."
          icon={<IconX size={32} />}
        />
      </>
    );

  const title = data.fleet?.licensePlate || "Depreciation";

  const cost = Number(data.acquisitionCost) || 0;
  const salvage = Number(data.salvageValue) || 0;
  const bookValue = currentBookValue(data, monthly);
  const depreciatedSoFar = cost - bookValue;
  const depreciable = cost - salvage;
  const progress =
    depreciable > 0 ? Math.min((depreciatedSoFar / depreciable) * 100, 100) : 0;

  const elapsed = monthsElapsed(data.startDate, data.usefulLifeMonths);
  const totalMonths = Number(data.usefulLifeMonths) || 0;
  const hasStarted =
    data.startDate && !dayjs(data.startDate).isAfter(dayjs(), "day");
  const endDate = depreciationEndDate(data);

  return (
    <>
      <RecordHeader
        title={title}
        titleTransform="uppercase"
        breadcrumbs={[...BREADCRUMBS, { label: title }]}
        badges={<DepreciationMethodBadge method={data.method} size="md" />}
        meta={<VehicleLink fleet={data.fleet} />}
        actions={
          <>
            <EditDepreciationModalButton depreciation={data} variant="button" />

            <DeleteDepreciationButton
              depreciationId={data._id}
              redirect
              variant="button"
            />
          </>
        }
      />

      <KeyFacts
        items={[
          {
            label: "Acquisition cost",
            value: formatAmount(cost),
            hint: data.startDate
              ? `From ${formatDate(data.startDate)}`
              : "No start date",
          },
          {
            label: "Book value today",
            value: formatAmount(bookValue),
            hint: "Estimated",
          },
          {
            label: "Depreciated so far",
            value: formatAmount(depreciatedSoFar),
            hint: `of ${formatAmount(depreciable)} depreciable`,
          },
          {
            label: "Salvage value",
            value: formatAmount(salvage),
            hint: endDate ? `At ${formatDate(endDate)}` : "End of useful life",
          },
        ]}
      />

      <DetailLayout
        main={
          <Stack gap="md">
            <DetailPanel title="Progress">
              <Stack gap={6}>
                <Group justify="space-between" gap="xs" wrap="wrap">
                  <Text fz="sm" fw={600}>
                    {hasStarted
                      ? `${elapsed} of ${totalMonths} months elapsed`
                      : `Starts ${formatDate(data.startDate)}`}
                  </Text>

                  <Text fz="sm" c="dimmed">
                    {Math.round(progress)}% depreciated
                  </Text>
                </Group>

                <Progress
                  value={progress}
                  size="md"
                  radius="xl"
                  aria-label="Share of the depreciable amount written off"
                />
              </Stack>
            </DetailPanel>

            <DetailPanel title="Projected schedule">
              <Stack gap="sm">
                <Text fz="xs" c="dimmed">
                  Estimated year by year from the values on this record. The
                  current year is highlighted.
                </Text>

                {years.length ? (
                  <ScheduleTable years={years} elapsed={elapsed} />
                ) : (
                  <Text fz="sm" c="dimmed">
                    Set a useful life to see the schedule.
                  </Text>
                )}
              </Stack>
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
                    label: "Method",
                    value: getDepreciationMethod(data.method).label,
                  },
                  {
                    label: "Rate",
                    value:
                      data.depreciationRate != null
                        ? `${data.depreciationRate}% a year`
                        : null,
                  },
                  {
                    label: "Useful life",
                    value: formatLife(data.usefulLifeMonths),
                  },
                  {
                    label: "Starts",
                    value: data.startDate ? formatDate(data.startDate) : null,
                  },
                  {
                    label: "Ends",
                    value: endDate ? formatDate(endDate) : null,
                  },
                ],
              },
            ]}
            footer={
              <RecordMeta
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

export default DepreciationDetails;
