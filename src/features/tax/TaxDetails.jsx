import { Alert, Center, Loader, Stack, Text } from "@mantine/core";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useGetTaxByIdQuery } from "../../api/tax";
import DetailLayout from "../../components/DetailLayout";
import DetailPanel from "../../components/DetailPanel";
import KeyFacts from "../../components/KeyFacts";
import PeriodTrack from "../../components/PeriodTrack";
import PicklistBadge from "../../components/PicklistBadge";
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
import DeleteTaxButton from "./DeleteTaxButton";
import EditTaxModalButton from "./EditTaxModalButton";
import TaxHistory from "./TaxHistory";

const BREADCRUMBS = [{ label: "Fleet" }, { label: "Tax", to: "/tax" }];

/** Average month length, for the "per month" equivalent of a tax amount. */
const DAYS_PER_MONTH = 30.44;

/** Where the filing stands: filed, still open, or overdue. */
const getFiling = (data, isLapsed) => {
  if (data.filingDate) {
    const delay =
      data.endDate && new Date(data.filingDate) > new Date(data.endDate)
        ? daysBetween(data.endDate, data.filingDate)
        : 0;

    return {
      value: "Filed",
      hint: `${formatDate(data.filingDate)} · ${
        delay ? `${formatDuration(delay)} after period end` : "within period"
      }`,
    };
  }

  if (isLapsed)
    return {
      value: "Overdue",
      hint: `Period ended ${formatDuration(daysBetween(data.endDate, new Date()))} ago`,
      color: "red",
    };

  return { value: "Pending", hint: "Not filed yet", color: "orange" };
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
        <RecordHeader title="Tax record" breadcrumbs={BREADCRUMBS} />

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

  const isLapsed = data.endDate && new Date(data.endDate) < new Date();
  const periodDays = daysBetween(data.startDate, data.endDate);
  const daysLeft = data.endDate ? daysBetween(new Date(), data.endDate) : null;
  const elapsedShare = periodDays
    ? Math.min(
        100,
        Math.round(((periodDays - (daysLeft ?? 0)) / periodDays) * 100),
      )
    : 0;

  const filing = getFiling(data, isLapsed);
  const monthly =
    periodDays >= 28 && data.taxAmount
      ? Math.round(data.taxAmount / (periodDays / DAYS_PER_MONTH))
      : null;

  return (
    <>
      <RecordHeader
        title={data.challanNumber || "Tax record"}
        titleTransform="uppercase"
        breadcrumbs={[
          ...BREADCRUMBS,
          { label: data.challanNumber || "Tax record" },
        ]}
        badges={<PicklistBadge item={data.status} size="md" />}
        meta={<VehicleLink fleet={data.fleet} />}
        actions={
          <>
            <EditTaxModalButton tax={data} variant="button" />

            <DeleteTaxButton taxId={data._id} redirect variant="button" />
          </>
        }
      />

      {filing.value === "Overdue" && (
        <Alert
          color="red"
          icon={<IconAlertTriangle size={18} />}
          title="Filing overdue"
          mb="md"
        >
          The tax period ended on {formatDate(data.endDate)} and no filing date
          has been recorded.
        </Alert>
      )}

      <KeyFacts
        items={[
          {
            label: "Tax amount",
            value: formatAmount(data.taxAmount || 0),
            hint: monthly
              ? `≈ ${formatAmount(monthly)} per month`
              : "For the full period",
          },
          {
            label: "Jurisdiction",
            value: picklistTitle(data.jurisdiction) || "—",
            tt: "capitalize",
            hint: "Filing authority",
          },
          {
            label: "Filing",
            value: filing.value,
            hint: filing.hint,
            hintColor: filing.color,
          },
          {
            label: "Time left",
            value: isLapsed
              ? "Ended"
              : daysLeft != null
                ? formatDuration(daysLeft)
                : "Open",
            hint:
              periodDays != null
                ? `of ${formatDuration(periodDays)}`
                : "No end date",
          },
        ]}
      />

      <DetailLayout
        main={
          <Stack gap="md">
            <DetailPanel title="Tax period">
              {data.startDate && data.endDate ? (
                <PeriodTrack
                  start={data.startDate}
                  end={data.endDate}
                  marker={
                    data.filingDate && {
                      label: "Filed",
                      date: data.filingDate,
                      color: "teal",
                    }
                  }
                  caption={
                    isLapsed ? "Period complete" : `${elapsedShare}% elapsed`
                  }
                />
              ) : (
                <Text fz="sm" c="dimmed">
                  No tax period recorded.
                </Text>
              )}
            </DetailPanel>

            {data.fleet && <TaxHistory tax={data} />}
          </Stack>
        }
        aside={
          <PropertyCard
            sections={[
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

export default TaxDetails;
