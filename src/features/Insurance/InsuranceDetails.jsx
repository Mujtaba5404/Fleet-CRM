import {
  Alert,
  Center,
  Divider,
  Group,
  Loader,
  Progress,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconBan,
  IconClock,
  IconX,
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useGetInsuranceByIdQuery } from "../../api/insurance";
import DetailLayout from "../../components/DetailLayout";
import DetailPanel from "../../components/DetailPanel";
import KeyFacts from "../../components/KeyFacts";
import Placeholder from "../../components/Placeholder";
import PropertyCard from "../../components/PropertyCard";
import RecordHeader from "../../components/RecordHeader";
import RecordMeta from "../../components/RecordMeta";
import daysBetween from "../../utils/daysBetween";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import formatDuration from "../../utils/formatDuration";
import picklistTitle from "../../utils/picklistTitle";
import VehicleLink from "../fleets/VehicleLink";
import DeleteInsuranceButton from "./DeleteInsuranceButton";
import EditInsuranceModalButton from "./EditInsuranceModalButton";
import InsuranceStatusBadge from "./InsuranceStatusBadge";

const BREADCRUMBS = [
  { label: "Fleet" },
  { label: "Insurance", to: "/insurance" },
];

/** Cover ending within this many days gets a heads-up. */
const EXPIRY_WARNING_DAYS = 30;

const SummaryRow = ({ label, value, strong = false }) => (
  <Group justify="space-between" wrap="nowrap">
    <Text
      fz="sm"
      c={strong ? undefined : "dimmed"}
      fw={strong ? 600 : undefined}
    >
      {label}
    </Text>

    <Text fz={strong ? "md" : "sm"} fw={strong ? 700 : 500} className="numeric">
      {value}
    </Text>
  </Group>
);

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
        <RecordHeader title="Policy" breadcrumbs={BREADCRUMBS} />

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
  const expiringSoon =
    !isCancelled &&
    !isExpired &&
    daysLeft != null &&
    daysLeft <= EXPIRY_WARNING_DAYS;

  const coverValue = isCancelled
    ? "Cancelled"
    : isExpired
      ? "Expired"
      : daysLeft != null
        ? `${formatDuration(daysLeft)} left`
        : "Open";

  return (
    <>
      <RecordHeader
        title={data.policyNumber || "Policy"}
        titleTransform="uppercase"
        breadcrumbs={[...BREADCRUMBS, { label: data.policyNumber || "Policy" }]}
        badges={<InsuranceStatusBadge insurance={data} size="md" />}
        meta={<VehicleLink fleet={data.fleet} />}
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

      {isCancelled ? (
        <Alert
          color="red"
          icon={<IconBan size={18} />}
          title={`Cancelled on ${formatDate(data.cancellationDate)}`}
          mb="md"
        >
          {data.cancellationReason || "No reason recorded."}
        </Alert>
      ) : isExpired ? (
        <Alert
          color="orange"
          icon={<IconAlertTriangle size={18} />}
          title="Cover has ended"
          mb="md"
        >
          This policy stopped covering the vehicle on {formatDate(data.endDate)}
          .
        </Alert>
      ) : (
        expiringSoon && (
          <Alert
            color="yellow"
            icon={<IconClock size={18} />}
            title={`Cover ends in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
            mb="md"
          >
            Renew before {formatDate(data.endDate)} to keep the vehicle covered.
          </Alert>
        )
      )}

      <KeyFacts
        items={[
          {
            label: "Total payable",
            value: formatAmount(payable),
            hint:
              data.taxAmount || data.discountAmount
                ? "After tax and discount"
                : "Premium",
          },
          {
            label: "Coverage limit",
            value: formatAmount(coverageLimit),
            hint: coverages.length
              ? `${coverages.length} coverage ${coverages.length === 1 ? "line" : "lines"}`
              : "Single limit",
          },
          {
            label: "Provider",
            value: picklistTitle(data.provider) || "—",
            tt: "capitalize",
            hint: "Insurer",
          },
          {
            label: "Cover",
            value: coverValue,
            hint:
              termDays != null
                ? `${formatDuration(termDays)} term`
                : "No end date",
            footer: termDays != null && !isCancelled && (
              <Progress
                value={elapsedShare}
                size="sm"
                radius="xl"
                mt={4}
                color={isExpired ? "orange" : expiringSoon ? "yellow" : "brand"}
                aria-label="Term elapsed"
              />
            ),
          },
        ]}
      />

      <DetailLayout
        main={
          <DetailPanel title="Coverage & premium">
            <Stack gap="md">
              {coverages.length ? (
                <Table.ScrollContainer minWidth={460}>
                  <Table verticalSpacing="xs" highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Coverage</Table.Th>
                        <Table.Th ta="right">Limit</Table.Th>
                        <Table.Th ta="right">Deductible</Table.Th>
                        <Table.Th ta="right">Premium</Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {coverages.map((row, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>
                            <Text fz="sm" fw={500} tt="capitalize">
                              {picklistTitle(row.type) || "—"}
                            </Text>
                          </Table.Td>

                          <Table.Td ta="right" className="numeric">
                            {formatAmount(row.limit || 0)}
                          </Table.Td>

                          <Table.Td ta="right" className="numeric">
                            {formatAmount(row.deductible || 0)}
                          </Table.Td>

                          <Table.Td ta="right" className="numeric">
                            {formatAmount(row.premium || 0)}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              ) : (
                <Text fz="sm" c="dimmed">
                  No coverage breakdown recorded for this policy.
                </Text>
              )}

              {/* Invoice-style total, aligned under the premium column. */}
              <Stack gap={6} ml="auto" w="100%" maw={320}>
                <SummaryRow label="Premium" value={formatAmount(premium)} />

                {data.taxAmount != null && (
                  <SummaryRow
                    label="Tax"
                    value={`+ ${formatAmount(data.taxAmount)}`}
                  />
                )}

                {data.discountAmount != null && (
                  <SummaryRow
                    label="Discount"
                    value={`− ${formatAmount(data.discountAmount)}`}
                  />
                )}

                <Divider />

                <SummaryRow
                  label="Total payable"
                  value={formatAmount(payable)}
                  strong
                />
              </Stack>
            </Stack>
          </DetailPanel>
        }
        aside={
          <PropertyCard
            sections={[
              {
                title: "Policy",
                items: [
                  {
                    label: "Broker",
                    value: picklistTitle(data.broker),
                    tt: "capitalize",
                  },
                  {
                    label: "Policy type",
                    value: picklistTitle(data.type),
                    tt: "capitalize",
                  },
                ],
              },
              {
                title: "Term",
                items: [
                  {
                    label: "Starts",
                    value: data.startDate && formatDate(data.startDate),
                    numeric: true,
                  },
                  {
                    label: "Ends",
                    value: data.endDate && formatDate(data.endDate),
                    numeric: true,
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

export default InsuranceDetails;
