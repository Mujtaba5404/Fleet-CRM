import {
  Anchor,
  Badge,
  Center,
  Group,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCar,
  IconChevronRight,
  IconFileText,
  IconReceiptTax,
  IconShieldCheck,
  IconTool,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useGetfleetsWithPaginationQuery } from "../api/fleet";
import { useGetAllInsuranceQuery } from "../api/insurance";
import { useGetMaintenanceWithPaginationQuery } from "../api/maintenance";
import { useGetAllTaxQuery } from "../api/tax";
import DetailPanel from "../components/DetailPanel";
import PageHeader from "../components/PageHeader";
import StatTile from "../components/StatTile";
import MaintenanceStatusBadge from "../features/maintenance/MaintenanceStatusBadge";
import formatAmount from "../utils/formatAmount";
import formatDate from "../utils/formatDate";

const RENEWAL_WINDOW_DAYS = 60;

/** The `/all` endpoints return a bare array; the paginated ones wrap it. */
const toList = (data) => (Array.isArray(data) ? data : (data?.data ?? []));

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

/** Share-of-total bar for the vehicle status mix. */
const StatusMix = ({ fleets }) => {
  const counts = fleets.reduce((acc, fleet) => {
    const key = fleet.status?.title || "Unknown";
    acc[key] = acc[key] || { count: 0, color: fleet.status?.color || "gray" };
    acc[key].count += 1;
    return acc;
  }, {});

  const entries = Object.entries(counts).sort(
    (a, b) => b[1].count - a[1].count,
  );
  const total = fleets.length;

  if (!total) return <EmptyRow>No vehicles yet</EmptyRow>;

  return (
    <Stack gap="sm">
      <Progress.Root size={14}>
        {entries.map(([label, { count, color }]) => (
          <Progress.Section
            key={label}
            value={(count / total) * 100}
            color={color}
          >
            <Progress.Label>{count}</Progress.Label>
          </Progress.Section>
        ))}
      </Progress.Root>

      <Group gap="xs">
        {entries.map(([label, { count, color }]) => (
          <Badge key={label} size="sm" color={color} tt="capitalize">
            {label} · {count}
          </Badge>
        ))}
      </Group>
    </Stack>
  );
};

const Dashboard = () => {
  const fleets = useGetfleetsWithPaginationQuery({
    page: 1,
    pageSize: 100,
    sort: "-createdAt",
  });
  const maintenance = useGetMaintenanceWithPaginationQuery({
    page: 1,
    pageSize: 5,
    sort: "-createdAt",
  });
  const insurance = useGetAllInsuranceQuery();
  const tax = useGetAllTaxQuery();

  const fleetList = toList(fleets.data);
  const maintenanceList = toList(maintenance.data);
  const insuranceList = toList(insurance.data);
  const taxList = toList(tax.data);

  const today = dayjs();
  const horizon = today.add(RENEWAL_WINDOW_DAYS, "day");

  const expiringPolicies = insuranceList
    .filter((policy) => {
      if (!policy.endDate) return false;
      const end = dayjs(policy.endDate);
      return end.isAfter(today) && end.isBefore(horizon);
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  const expiredPolicies = insuranceList.filter(
    (policy) => policy.endDate && dayjs(policy.endDate).isBefore(today),
  );

  const unfiledTax = taxList
    .filter((record) => !record.filingDate)
    .sort((a, b) => new Date(a.endDate || 0) - new Date(b.endDate || 0));

  const attentionCount = expiringPolicies.length + unfiledTax.length;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Fleet health at a glance · ${formatDate(new Date())}`}
      />

      <Stack gap="md">
        <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
          <StatTile
            label="Vehicles"
            value={(fleets.data?.meta?.totalCount ?? 0).toLocaleString()}
            hint="In your fleet"
            icon={IconCar}
            color="brand"
            to="/fleets"
            loading={fleets.isLoading}
          />

          <StatTile
            label="Maintenance jobs"
            value={(maintenance.data?.meta?.totalCount ?? 0).toLocaleString()}
            hint="Logged to date"
            icon={IconTool}
            color="cyan"
            to="/maintenance"
            loading={maintenance.isLoading}
          />

          <StatTile
            label="Policies"
            value={insuranceList.length.toLocaleString()}
            hint={
              expiredPolicies.length
                ? `${expiredPolicies.length} expired`
                : "All in date"
            }
            icon={IconShieldCheck}
            color={expiredPolicies.length ? "orange" : "teal"}
            to="/insurance"
            loading={insurance.isLoading}
          />

          <StatTile
            label="Tax challans"
            value={taxList.length.toLocaleString()}
            hint={
              unfiledTax.length ? `${unfiledTax.length} not filed` : "All filed"
            }
            icon={IconReceiptTax}
            color={unfiledTax.length ? "orange" : "teal"}
            to="/tax"
            loading={tax.isLoading}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
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
              <Center h={120}>
                <Loader size="sm" />
              </Center>
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
                      policy.fleet?.licensePlate ||
                      policy.provider?.title ||
                      "—"
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
            title="Vehicle status"
            icon={IconCar}
            action={<PanelLink to="/fleets" />}
          >
            {fleets.isLoading ? (
              <Center h={120}>
                <Loader size="sm" />
              </Center>
            ) : (
              <StatusMix fleets={fleetList} />
            )}
          </Panel>
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
          <Panel
            title="Recent maintenance"
            icon={IconTool}
            action={<PanelLink to="/maintenance" />}
          >
            {maintenance.isLoading ? (
              <Center h={120}>
                <Loader size="sm" />
              </Center>
            ) : !maintenanceList.length ? (
              <EmptyRow>No maintenance logged yet</EmptyRow>
            ) : (
              <Stack gap={0}>
                {maintenanceList.map((job) => (
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
              <Center h={120}>
                <Loader size="sm" />
              </Center>
            ) : !fleetList.length ? (
              <EmptyRow>No vehicles yet</EmptyRow>
            ) : (
              <Stack gap={0}>
                {fleetList.slice(0, 5).map((fleet) => (
                  <Row
                    key={fleet._id}
                    to={`/fleets/${fleet._id}`}
                    title={
                      [fleet.make?.title, fleet.model?.title]
                        .filter(Boolean)
                        .join(" ") || "Vehicle"
                    }
                    subtitle={
                      [fleet.year, fleet.color].filter(Boolean).join(" · ") ||
                      "—"
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
      </Stack>
    </>
  );
};

export default Dashboard;
