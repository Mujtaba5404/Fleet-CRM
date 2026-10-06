import {
  Avatar,
  Badge,
  Divider,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useGetRolesWithPaginationQuery } from "../../api/role";
import PaginatedTable from "../../components/PaginatedTable";
import useFilters from "../../hooks/useFilters";
import formatDate from "../../utils/formatDate";
import getAbbreviation from "../../utils/getAbbreviation";
import RoleTableRowMenu from "./RoleTableRowMenu";
import {
  describeActions,
  getScopeOption,
  humanize,
  summarizeRole,
} from "./roleForm";
import ScopeBadge from "./ScopeBadge";
import usePermissionCatalog from "./usePermissionCatalog";

const MAX_RESOURCE_BADGES = 3;

const roleLink = (role) => `/admin-settings/roles/${role._id}`;

const RoleName = ({ role }) => (
  <UnstyledButton component={Link} to={roleLink(role)} miw={0}>
    <Group gap="sm" wrap="nowrap">
      <Avatar
        size={34}
        radius="md"
        color={getScopeOption(role.scope)?.color || "gray"}
      >
        {getAbbreviation(role.title || "?")}
      </Avatar>

      <Stack gap={0} miw={0}>
        <Text size="sm" fw={600} tt="capitalize" truncate>
          {role.title || "Untitled role"}
        </Text>

        <Text size="xs" c="dimmed" truncate>
          Lands on {role.indexPath || "/"}
        </Text>
      </Stack>
    </Group>
  </UnstyledButton>
);

const ResourceBadges = ({ permissions = [] }) => {
  const granted = permissions.filter((p) => p.actions?.length);

  if (!granted.length)
    return (
      <Text size="sm" c="dimmed">
        No access
      </Text>
    );

  const shown = granted.slice(0, MAX_RESOURCE_BADGES);
  const hidden = granted.slice(MAX_RESOURCE_BADGES);

  return (
    <Group gap={4} wrap="nowrap">
      {shown.map((p) => (
        <Tooltip key={p.resource} label={describeActions(p.actions)}>
          <Badge size="sm" color="gray" tt="none">
            {humanize(p.resource)}
          </Badge>
        </Tooltip>
      ))}

      {hidden.length > 0 && (
        <Tooltip
          label={hidden.map((p) => humanize(p.resource)).join(", ")}
          maw={260}
        >
          <Badge size="sm" variant="outline" color="gray">
            +{hidden.length}
          </Badge>
        </Tooltip>
      )}
    </Group>
  );
};

const Coverage = ({ summary }) => {
  const percent = summary.total ? (summary.granted / summary.total) * 100 : 0;

  return (
    <Stack gap={4}>
      <Group justify="space-between" gap="xs" wrap="nowrap">
        <Text size="xs" fw={600} className="numeric">
          {summary.granted}/{summary.total}
        </Text>

        <Text size="xs" c="dimmed" className="numeric">
          {Math.round(percent)}%
        </Text>
      </Group>

      <Progress
        value={percent}
        size="sm"
        radius="xl"
        color={percent === 100 ? "orange" : "brand"}
      />
    </Stack>
  );
};

const DEFAULT_COLUMNS = (catalog) => [
  {
    accessor: "title",
    title: "Role",
    width: 260,
    sortable: true,
    render: (row) => <RoleName role={row} />,
  },
  {
    accessor: "scope",
    width: 150,
    textAlign: "center",
    sortable: true,
    render: (row) => <ScopeBadge scope={row.scope} />,
  },
  {
    accessor: "permissions",
    title: "Resources",
    width: 320,
    render: (row) => <ResourceBadges permissions={row.permissions} />,
  },
  {
    accessor: "coverage",
    title: "Permissions",
    width: 160,
    render: (row) => <Coverage summary={summarizeRole(row, catalog)} />,
  },
  {
    accessor: "updatedAt",
    title: "Updated",
    width: 130,
    textAlign: "center",
    sortable: true,
    render: (row) => formatDate(row.updatedAt || row.createdAt),
  },
  {
    accessor: "menu",
    title: "",
    width: 70,
    textAlign: "center",
    render: (row) => <RoleTableRowMenu role={row} />,
  },
];

const RoleCard = (row, catalog) => {
  const summary = summarizeRole(row, catalog);

  return (
    <Stack gap="sm">
      <Group justify="space-between" wrap="nowrap" align="flex-start">
        <RoleName role={row} />
        <RoleTableRowMenu role={row} />
      </Group>

      <Group gap={6}>
        <ScopeBadge scope={row.scope} />
      </Group>

      <ResourceBadges permissions={row.permissions} />

      <Divider />

      <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
        <Coverage summary={summary} />

        <Stack gap={0} align="flex-end">
          <Text size="sm">{formatDate(row.updatedAt || row.createdAt)}</Text>
          <Text size="xs" c="dimmed">
            Updated
          </Text>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
};

const RoleTable = ({ query, hideColumns = [], toolbar }) => {
  const { filters } = useFilters({});
  const catalog = usePermissionCatalog();

  return (
    <PaginatedTable
      queryHook={useGetRolesWithPaginationQuery}
      columns={DEFAULT_COLUMNS(catalog)}
      queryParams={{ ...filters, ...query }}
      hideColumns={hideColumns}
      mobileCard={(row) => RoleCard(row, catalog)}
      toolbar={toolbar}
    />
  );
};

export default RoleTable;
