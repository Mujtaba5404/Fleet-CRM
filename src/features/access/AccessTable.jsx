import {
  Avatar,
  Badge,
  Code,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useMemo } from "react";
import {
  authUserId,
  idOf,
  useGetAccessUsersQuery,
  useGetAccessWithPaginationQuery,
} from "../../api/access";
import PaginatedTable from "../../components/PaginatedTable";
import formatDate from "../../utils/formatDate";
import { getScopeOption } from "../roles/roleForm";
import AccessTableRowMenu from "./AccessTableRowMenu";

const Dash = () => (
  <Text fz="sm" c="dimmed">
    —
  </Text>
);

const UserCell = ({ user, isSelf }) => (
  <Group gap="sm" wrap="nowrap" miw={0}>
    <Avatar
      size={34}
      radius="xl"
      color="initials"
      name={user?.name || user?.email || "?"}
    />

    <Stack gap={0} miw={0}>
      <Group gap={6} wrap="nowrap">
        <Text fz="sm" fw={600} tt="capitalize" truncate>
          {user?.name || "Unknown user"}
        </Text>

        {isSelf && (
          <Badge size="xs" variant="light">
            You
          </Badge>
        )}

        {user?.isActive === false && (
          <Badge size="xs" variant="light" color="gray">
            Inactive
          </Badge>
        )}
      </Group>

      <Text fz="xs" c="dimmed" truncate>
        {user?.email || "Not found in the user directory"}
      </Text>
    </Stack>
  </Group>
);

const RoleBadges = ({ roles = [] }) =>
  roles.length ? (
    <Group gap={6} wrap="wrap">
      {roles.map((role) => {
        const scope = getScopeOption(role.scope);
        const resources = (role.permissions ?? []).filter(
          (permission) => permission.actions?.length,
        ).length;

        return (
          <Tooltip
            key={role._id}
            label={`${scope?.label ?? "No"} scope · ${resources} ${resources === 1 ? "resource" : "resources"}`}
            withArrow
          >
            <Badge
              variant="dot"
              color={scope?.color ?? "gray"}
              tt="capitalize"
              fw={500}
              size="md"
              style={{ cursor: "default" }}
            >
              {role.title || "Untitled role"}
            </Badge>
          </Tooltip>
        );
      })}
    </Group>
  ) : (
    <Badge variant="light" color="red" tt="none">
      No role
    </Badge>
  );

const buildColumns = (lookupUser, selfId) => [
  {
    accessor: "user",
    title: "User",
    width: 280,
    noWrap: true,
    render: (access) => (
      <UserCell
        user={lookupUser(access.user)}
        isSelf={idOf(access.user) === selfId}
      />
    ),
  },
  {
    accessor: "roles",
    title: "Role",
    width: 220,
    render: (access) => <RoleBadges roles={access.roles} />,
  },
  {
    accessor: "indexPath",
    title: "Landing page",
    width: 150,
    render: (access) => {
      const path = access.roles?.find((role) => role.indexPath)?.indexPath;

      return path ? <Code fz="xs">{path}</Code> : <Dash />;
    },
  },
  {
    accessor: "companies",
    title: "Companies",
    width: 180,
    render: (access) => {
      const companies = lookupUser(access.user)?.companies ?? [];

      return companies.length ? (
        <Text fz="sm" tt="capitalize" truncate>
          {companies.map((company) => company.title).join(", ")}
        </Text>
      ) : (
        <Dash />
      );
    },
  },
  {
    accessor: "updatedAt",
    title: "Updated",
    width: 130,
    textAlign: "center",
    sortable: true,
    render: (access) => formatDate(access.updatedAt),
  },
  {
    accessor: "menu",
    title: "",
    width: 70,
    textAlign: "center",
    render: (access) => (
      <AccessTableRowMenu
        access={access}
        isSelf={idOf(access.user) === selfId}
      />
    ),
  },
];

/** Phone-sized representation of one user's access. */
const AccessCard = ({ access, user, isSelf }) => (
  <Stack gap="sm">
    <Group justify="space-between" wrap="nowrap" align="flex-start">
      <UserCell user={user} isSelf={isSelf} />
      <AccessTableRowMenu access={access} isSelf={isSelf} />
    </Group>

    <RoleBadges roles={access.roles} />

    <SimpleGrid cols={2} spacing="xs">
      <Text fz="xs" c="dimmed" tt="capitalize" truncate>
        {(user?.companies ?? []).map((company) => company.title).join(", ") ||
          "No company"}
      </Text>
      <Text fz="xs" c="dimmed" ta="right">
        Updated {formatDate(access.updatedAt)}
      </Text>
    </SimpleGrid>
  </Stack>
);

/**
 * Access records only carry the user's id, so names, emails and companies are
 * looked up in the `access/users` directory.
 */
const AccessTable = () => {
  const [auth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });
  const selfId = authUserId(auth);

  const users = useGetAccessUsersQuery();
  const usersById = useMemo(
    () => new Map((users.data ?? []).map((user) => [user._id, user])),
    [users.data],
  );

  const lookupUser = useCallback(
    (user) =>
      user && typeof user === "object" ? user : (usersById.get(user) ?? null),
    [usersById],
  );

  const columns = useMemo(
    () => buildColumns(lookupUser, selfId),
    [lookupUser, selfId],
  );

  return (
    <PaginatedTable
      queryHook={useGetAccessWithPaginationQuery}
      columns={columns}
      mobileCard={(access) => (
        <AccessCard
          access={access}
          user={lookupUser(access.user)}
          isSelf={idOf(access.user) === selfId}
        />
      )}
      tableProps={{ pinFirstColumn: true }}
    />
  );
};

export default AccessTable;
