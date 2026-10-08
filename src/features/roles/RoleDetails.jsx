import {
  ActionIcon,
  Avatar,
  Badge,
  Center,
  CopyButton,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy, IconStack2, IconX } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useGetRoleByIdQuery } from "../../api/role";
import DetailLayout from "../../components/DetailLayout";
import DetailPanel from "../../components/DetailPanel";
import KeyFacts from "../../components/KeyFacts";
import Placeholder from "../../components/Placeholder";
import PropertyCard from "../../components/PropertyCard";
import RecordHeader from "../../components/RecordHeader";
import RecordMeta from "../../components/RecordMeta";
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
        <RecordHeader title="Role" breadcrumbs={BREADCRUMBS} />

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
      <RecordHeader
        title={data.title || "Role"}
        breadcrumbs={[...BREADCRUMBS, { label: data.title || "Role" }]}
        avatar={
          <Avatar
            size={48}
            radius="md"
            color={scope?.color || "gray"}
            visibleFrom="xs"
          >
            {getAbbreviation(data.title || "?")}
          </Avatar>
        }
        badges={<ScopeBadge scope={data.scope} size="md" />}
        meta={scope?.description || "No data scope set"}
        actions={
          <>
            <EditRoleModalButton role={data} variant="button" />

            <DeleteRoleButton roleId={data._id} redirect variant="button" />
          </>
        }
      />

      <KeyFacts
        items={[
          {
            label: "Permissions",
            value: `${summary.granted}/${summary.total}`,
            hint: `Across ${summary.resources} of ${summary.totalResources} resources`,
          },
          {
            label: "Full access",
            value: summary.fullAccess,
            hint: "Create, read, update, delete",
          },
          {
            label: "Read only",
            value: summary.readOnly,
            hint: "View without changing",
          },
          {
            label: "Editable fields",
            value: summary.editableFields,
            hint: "Across every resource",
          },
        ]}
      />

      <DetailLayout
        main={
          <Stack gap="md">
            <DetailPanel title="Permission matrix">
              <PermissionSummary role={data} catalog={catalog} />
            </DetailPanel>

            <DetailPanel title="Editable fields">
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
                        <ThemeIcon
                          size={26}
                          radius="sm"
                          variant="light"
                          color="gray"
                        >
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
          </Stack>
        }
        aside={
          <PropertyCard
            sections={[
              {
                title: "Settings",
                items: [
                  { label: "Landing page", value: data.indexPath || "/" },
                  {
                    label: "Role ID",
                    value: (
                      <Group gap={4} wrap="nowrap" miw={0}>
                        <Text fz="xs" c="dimmed" ff="monospace" truncate>
                          {data._id}
                        </Text>

                        <CopyButton value={data._id}>
                          {({ copied, copy }) => (
                            <Tooltip label={copied ? "Copied" : "Copy ID"}>
                              <ActionIcon
                                size="sm"
                                color={copied ? "teal" : "gray"}
                                onClick={copy}
                                aria-label="Copy role ID"
                              >
                                {copied ? (
                                  <IconCheck size={14} />
                                ) : (
                                  <IconCopy size={14} />
                                )}
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </CopyButton>
                      </Group>
                    ),
                  },
                ],
              },
            ]}
            footer={
              <RecordMeta
                createdAt={data.createdAt}
                updatedAt={data.updatedAt || data.createdAt}
              />
            }
          />
        }
      />
    </>
  );
};

export default RoleDetails;
