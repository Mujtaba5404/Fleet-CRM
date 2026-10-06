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
  ThemeIcon,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconEye,
  IconForms,
  IconPencil,
  IconSettings,
  IconShieldCheck,
  IconShieldLock,
  IconStack2,
  IconX,
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useGetRoleByIdQuery } from "../../api/role";
import DetailHero from "../../components/DetailHero";
import DetailPanel from "../../components/DetailPanel";
import PageHeader from "../../components/PageHeader";
import Placeholder from "../../components/Placeholder";
import StatTile from "../../components/StatTile";
import formatDate from "../../utils/formatDate";
import getAbbreviation from "../../utils/getAbbreviation";
import DeleteRoleButton from "./DeleteRoleButton";
import EditRoleModalButton from "./EditRoleModalButton";
import PermissionSummary from "./PermissionSummary";
import { getScopeOption, humanize, summarizeRole } from "./roleForm";
import ScopeBadge from "./ScopeBadge";
import usePermissionCatalog from "./usePermissionCatalog";

const BREADCRUMBS = [
  { label: "Configuration" },
  { label: "Roles", to: "/admin-settings/roles" },
];

const RoleDetails = () => {
  const { id } = useParams();

  const role = useGetRoleByIdQuery(id);
  const catalog = usePermissionCatalog(role.data);

  if (role.isLoading)
    return (
      <Center h={320}>
        <Loader />
      </Center>
    );

  if (role.isError)
    return (
      <>
        <PageHeader back title="Role" breadcrumbs={BREADCRUMBS} />

        <Placeholder
          title={
            role.error?.response?.data?.message ||
            role.error?.message ||
            "Error"
          }
          description="We could not load this role. It may have been deleted."
          icon={<IconX size={32} />}
        />
      </>
    );

  const data = role.data;
  const scope = getScopeOption(data.scope);
  const summary = summarizeRole(data, catalog);
  const editable = (data.permissions ?? []).filter(
    (p) => p.actions?.includes("update") && p.allowedUpdateFields?.length,
  );

  return (
    <>
      <PageHeader
        back
        title={data.title || "Role"}
        description={`Created ${formatDate(data.createdAt)} · Updated ${formatDate(data.updatedAt || data.createdAt)}`}
        breadcrumbs={[...BREADCRUMBS, { label: data.title || "Role" }]}
        actions={
          <>
            <EditRoleModalButton role={data} variant="button" />

            <DeleteRoleButton roleId={data._id} redirect variant="button" />
          </>
        }
      />

      <Stack gap="md">
        <DetailHero
          railColor={scope?.color}
          title={
            <Group gap="sm" wrap="nowrap">
              <Avatar size={44} radius="md" color={scope?.color || "gray"}>
                {getAbbreviation(data.title || "?")}
              </Avatar>

              <Text fz="xl" fw={700} tt="capitalize">
                {data.title || "—"}
              </Text>
            </Group>
          }
          badges={<ScopeBadge scope={data.scope} size="md" />}
          subtitle={
            <Text fz="sm" c="dimmed">
              {scope?.description || "No data scope set"}
            </Text>
          }
          figureLabel="Permissions granted"
          figure={`${summary.granted}/${summary.total}`}
          figureHint={`Across ${summary.resources} of ${summary.totalResources} resources`}
        />

        <SimpleGrid cols={{ base: 2, lg: 4 }} spacing="md">
          <StatTile
            label="Resources"
            value={summary.resources}
            hint={`of ${summary.totalResources} available`}
            icon={IconStack2}
          />

          <StatTile
            label="Full access"
            value={summary.fullAccess}
            hint="Create, read, update, delete"
            icon={IconShieldCheck}
            color="teal"
          />

          <StatTile
            label="Read only"
            value={summary.readOnly}
            hint="View without changing"
            icon={IconEye}
            color="cyan"
          />

          <StatTile
            label="Editable fields"
            value={summary.editableFields}
            hint="Across every resource"
            icon={IconPencil}
            color="grape"
          />
        </SimpleGrid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <DetailPanel
              title="Permission matrix"
              icon={IconShieldLock}
              h="100%"
            >
              <PermissionSummary role={data} catalog={catalog} />
            </DetailPanel>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <DetailPanel title="Settings" icon={IconSettings}>
                <DetailPanel.FieldList>
                  <DetailPanel.Field label="Data scope">
                    <Group gap={6}>
                      <ScopeBadge scope={data.scope} />
                    </Group>
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Landing page" numeric>
                    {data.indexPath || "/"}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Role ID" numeric>
                    {data._id}
                  </DetailPanel.Field>
                </DetailPanel.FieldList>
              </DetailPanel>

              <DetailPanel title="Record" icon={IconCalendarEvent}>
                <SimpleGrid cols={2} spacing="md">
                  <DetailPanel.Field label="Created on" numeric>
                    {formatDate(data.createdAt)}
                  </DetailPanel.Field>

                  <DetailPanel.Field label="Last updated" numeric>
                    {formatDate(data.updatedAt || data.createdAt)}
                  </DetailPanel.Field>
                </SimpleGrid>
              </DetailPanel>
            </Stack>
          </Grid.Col>

          <Grid.Col span={12}>
            <DetailPanel title="Editable fields" icon={IconForms}>
              {editable.length ? (
                <Stack gap="md">
                  {editable.map((p) => {
                    const Icon =
                      catalog.find((entry) => entry.resource === p.resource)
                        ?.icon ?? IconStack2;

                    return (
                      <Group
                        key={p.resource}
                        gap="sm"
                        align="flex-start"
                        wrap="nowrap"
                      >
                        <ThemeIcon size={26} radius="sm" variant="light">
                          <Icon size={15} stroke={1.7} />
                        </ThemeIcon>

                        <Stack gap={6} miw={0}>
                          <Text fz="sm" fw={600}>
                            {humanize(p.resource)}
                          </Text>

                          <Group gap={6}>
                            {p.allowedUpdateFields.map((field) => (
                              <Badge
                                key={field}
                                size="sm"
                                color="gray"
                                tt="none"
                              >
                                {humanize(field)}
                              </Badge>
                            ))}
                          </Group>
                        </Stack>
                      </Group>
                    );
                  })}
                </Stack>
              ) : (
                <Text fz="sm" c="dimmed">
                  This role cannot update any records.
                </Text>
              )}
            </DetailPanel>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
};

export default RoleDetails;
