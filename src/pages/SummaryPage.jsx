import {
  Anchor,
  Badge,
  Center,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCar,
  IconCash,
  IconChevronRight,
  IconFileText,
  IconTool,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useGetAllfleetsQuery } from "../api/fleet";
import { useGetAllInsuranceQuery } from "../api/insurance";
import { useGetAllMaintenanceQuery } from "../api/maintenance";
import { useGetAllTaxQuery } from "../api/tax";
import DetailPanel from "../components/DetailPanel";
import PageHeader from "../components/PageHeader";
import StatTile from "../components/StatTile";
import FleetBreakdowns from "../features/dashboard/FleetBreakdowns";
import FleetGroupSummary from "../features/dashboard/FleetGroupSummary";
import { isCompleted } from "../features/maintenance/maintenanceForm";
import MaintenanceStatusBadge from "../features/maintenance/MaintenanceStatusBadge";
import formatAmount, { formatAmountCompact } from "../utils/formatAmount";
import formatDate from "../utils/formatDate";

const RENEWAL_WINDOW_DAYS = 60;
const RECENT_ROWS = 5;

/** The `/all` endpoints return a bare array; the paginated ones wrap it. */
const toList = (data) => (Array.isArray(data) ? data : (data?.data ?? []));

const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

/** Same card as the detail screens use, so the dashboard reads as one system. */
const Panel = (props) => <DetailPanel h="100%" {...props} />;

const PanelLink = ({ to }) => (
  <Anchor component={Link} to={to} fz="xs" fw={500}>
    <Group gap={2} wrap="nowrap">
      View all
      <IconChevronRight size={13} />
    </Group>
  </Anchor>
);

const EmptyRow = ({ children }) => (
  <Text fz="sm" c="dimmed" py="lg" ta="center">
    {children}
  </Text>
);

const PanelLoader = () => (
  <Center h={120}>
    <Loader size="sm" />
  </Center>
);

const Row = ({ to, title, subtitle, right, rightSub }) => (
  <UnstyledButton
    component={Link}
    to={to}
    py={8}
    style={{
      display: "block",
      borderTop: "1px solid var(--mantine-color-default-border)",
    }}
  >
    <Group justify="space-between" wrap="nowrap" gap="sm">
      <Stack gap={0} miw={0}>
        <Text fz="sm" fw={500} tt="capitalize" truncate>
          {title}
        </Text>
        <Text fz="xs" c="dimmed" tt="capitalize" truncate>
          {subtitle}
        </Text>
      </Stack>

      <Stack gap={0} align="flex-end" style={{ flexShrink: 0 }}>
        {right}
        {rightSub && (
          <Text fz="xs" c="dimmed">
            {rightSub}
          </Text>
        )}
      </Stack>
    </Group>
  </UnstyledButton>
);

/** A heading between the page's bands. */
const SectionTitle = ({ title, description }) => (
  <Stack gap={2} mt="sm">
    <Title order={4}>{title}</Title>
    {description && (
      <Text fz="sm" c="dimmed">
        {description}
      </Text>
    )}
  </Stack>
);

/**
 * The home screen (formerly "Dashboard"): headline numbers, the fleet's mix as
 * progress bars, the two-level grouped breakdown with charts, what needs
 * attention or happened recently, and the grouped table.
 */
const SummaryPage = () => {
  const fleets = useGetAllfleetsQuery();
  const maintenance = useGetAllMaintenanceQuery();
  const insurance = useGetAllInsuranceQuery();
  const tax = useGetAllTaxQuery();

  const fleetList = toList(fleets.data);
  const maintenanceList = toList(maintenance.data);
  const insuranceList = toList(insurance.data);
  const taxList = toList(tax.data);

  const fleetValue = fleetList.reduce(
    (sum, fleet) => sum + (Number(fleet.purchaseAmount) || 0),
    0,
  );
  const openJobs = maintenanceList.filter((job) => !isCompleted(job.status));
  const maintenanceCost = maintenanceList.reduce(
    (sum, job) => sum + (Number(job.cost) || 0),
    0,
  );

  const today = dayjs();
  const horizon = today.add(RENEWAL_WINDOW_DAYS, "day");

  const expiringPolicies = insuranceList
    .filter((policy) => {
      if (!policy.endDate) return false;
      const end = dayjs(policy.endDate);
      return end.isAfter(today) && end.isBefore(horizon);
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  const unfiledTax = taxList
    .filter((record) => !record.filingDate)
    .sort((a, b) => new Date(a.endDate || 0) - new Date(b.endDate || 0));

  const attentionCount = expiringPolicies.length + unfiledTax.length;

  const recentJobs = [...maintenanceList]
    .sort(newestFirst)
    .slice(0, RECENT_ROWS);
  const recentVehicles = [...fleetList].sort(newestFirst).slice(0, RECENT_ROWS);

  // Sits right under the grouped charts, above their table.
  const activity = (
    <>
      <SectionTitle title="Activity" />

      <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
        <Panel
          title="Needs attention"
          icon={IconAlertTriangle}
          action={
            attentionCount > 0 ? (
              <Badge color="orange" size="sm">
                {attentionCount}
              </Badge>
            ) : null
          }
        >
          {insurance.isLoading || tax.isLoading ? (
            <PanelLoader />
          ) : attentionCount === 0 ? (
            <EmptyRow>
              Nothing expiring in the next {RENEWAL_WINDOW_DAYS} days.
            </EmptyRow>
          ) : (
            <Stack gap={0}>
              {expiringPolicies.slice(0, 4).map((policy) => (
                <Row
                  key={policy._id}
                  to={`/insurance/${policy._id}`}
                  title={policy.policyNumber || "Policy"}
                  subtitle={
                    policy.fleet?.licensePlate || policy.provider?.title || "—"
                  }
                  right={
                    <Badge size="sm" color="orange">
                      {dayjs(policy.endDate).diff(today, "day")}d left
                    </Badge>
                  }
                  rightSub={formatDate(policy.endDate)}
                />
              ))}

              {unfiledTax.slice(0, 4).map((record) => (
                <Row
                  key={record._id}
                  to={`/tax/${record._id}`}
                  title={record.challanNumber || "Challan"}
                  subtitle={
                    record.fleet?.licensePlate ||
                    record.jurisdiction?.title ||
                    "—"
                  }
                  right={
                    <Badge size="sm" color="red">
                      Not filed
                    </Badge>
                  }
                  rightSub={
                    record.taxAmount != null
                      ? formatAmount(record.taxAmount)
                      : undefined
                  }
                />
              ))}
            </Stack>
          )}
        </Panel>

        <Panel
          title="Recent maintenance"
          icon={IconTool}
          action={<PanelLink to="/maintenance" />}
        >
          {maintenance.isLoading ? (
            <PanelLoader />
          ) : !recentJobs.length ? (
            <EmptyRow>No maintenance logged yet</EmptyRow>
          ) : (
            <Stack gap={0}>
              {recentJobs.map((job) => (
                <Row
                  key={job._id}
                  to={`/maintenance/${job._id}`}
                  title={job.type?.title || "Maintenance"}
                  subtitle={`${job.fleet?.licensePlate || "—"} · ${job.vendor?.title || "No vendor"}`}
                  right={
                    job.status ? (
                      <MaintenanceStatusBadge status={job.status} />
                    ) : null
                  }
                  rightSub={formatAmount(job.cost || 0)}
                />
              ))}
            </Stack>
          )}
        </Panel>

        <Panel
          title="Recently added vehicles"
          icon={IconFileText}
          action={<PanelLink to="/fleets" />}
        >
          {fleets.isLoading ? (
            <PanelLoader />
          ) : !recentVehicles.length ? (
            <EmptyRow>No vehicles yet</EmptyRow>
          ) : (
            <Stack gap={0}>
              {recentVehicles.map((fleet) => (
                <Row
                  key={fleet._id}
                  to={`/fleets/${fleet._id}`}
                  title={
                    [fleet.make?.title, fleet.model?.title]
                      .filter(Boolean)
                      .join(" ") || "Vehicle"
                  }
                  subtitle={
                    [fleet.year, fleet.color].filter(Boolean).join(" · ") || "—"
                  }
                  right={
                    <Badge size="sm" tt="uppercase">
                      {fleet.licensePlate || "—"}
                    </Badge>
                  }
                  rightSub={formatDate(fleet.createdAt)}
                />
              ))}
            </Stack>
          )}
        </Panel>
      </SimpleGrid>
    </>
  );

  return (
    <>
      <PageHeader
        title="Summary"
        description={`Fleet health at a glance · ${formatDate(new Date())}`}
      />

      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
          <StatTile
            label="Vehicles"
            value={fleetList.length.toLocaleString()}
            hint="In your fleet"
            icon={IconCar}
            to="/fleets"
            loading={fleets.isLoading}
          />

          <StatTile
            label="Fleet value"
            value={formatAmountCompact(fleetValue)}
            hint={`${formatAmount(fleetValue)} at purchase`}
            icon={IconCash}
            color="teal"
            loading={fleets.isLoading}
          />

          <StatTile
            label="Maintenance"
            value={maintenanceList.length.toLocaleString()}
            hint={`${openJobs.length} open · ${formatAmountCompact(maintenanceCost)} spent`}
            icon={IconTool}
            color="grape"
            to="/maintenance"
            loading={maintenance.isLoading}
          />

          <StatTile
            label="Needs attention"
            value={attentionCount.toLocaleString()}
            hint={`${expiringPolicies.length} renewals · ${unfiledTax.length} unfiled tax`}
            icon={IconAlertTriangle}
            color={attentionCount ? "orange" : "teal"}
            loading={insurance.isLoading || tax.isLoading}
          />
        </SimpleGrid>

        <SectionTitle
          title="Fleet mix"
          description="How your vehicles split by status, type, fuel and condition."
        />

        <FleetBreakdowns fleets={fleetList} isLoading={fleets.isLoading} />

        <SectionTitle
          title="Grouped breakdown"
          description="Vehicle counts and purchase value, grouped two levels deep."
        />

        <FleetGroupSummary afterCharts={activity} />
      </Stack>
    </>
  );
};

export default SummaryPage;
