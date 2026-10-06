import { Badge, Group, Stack, Table, Text, ThemeIcon } from "@mantine/core";
import { IconCheck, IconMinus } from "@tabler/icons-react";
import { ACTIONS, describeActions, humanize } from "./roleForm";

const Mark = ({ granted, label }) =>
  granted ? (
    <ThemeIcon
      size={22}
      radius="xl"
      variant="light"
      color="teal"
      aria-label={`${label}: allowed`}
    >
      <IconCheck size={14} stroke={2.4} />
    </ThemeIcon>
  ) : (
    <ThemeIcon
      size={22}
      radius="xl"
      variant="transparent"
      color="gray"
      aria-label={`${label}: not allowed`}
    >
      <IconMinus size={14} stroke={2} />
    </ThemeIcon>
  );

/**
 * Read-only resource × action grid for a role, listing every resource in the
 * catalog so what a role cannot do is as plain as what it can.
 */
const PermissionSummary = ({ role, catalog }) => {
  const byResource = new Map(
    (role.permissions ?? []).map((p) => [p.resource, p]),
  );

  return (
    <Table.ScrollContainer minWidth={600}>
      <Table verticalSpacing={10} highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Text fz="xs" fw={600} c="dimmed" tt="uppercase" lts="0.04em">
                Resource
              </Text>
            </Table.Th>

            {ACTIONS.map((action) => (
              <Table.Th key={action} ta="center" w={80}>
                <Text fz="xs" fw={600} c="dimmed" tt="uppercase" lts="0.04em">
                  {action}
                </Text>
              </Table.Th>
            ))}

            <Table.Th ta="center" w={110}>
              <Text fz="xs" fw={600} c="dimmed" tt="uppercase" lts="0.04em">
                Fields
              </Text>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {catalog.map(({ resource, icon: Icon, fields: catalogFields }) => {
            const permission = byResource.get(resource);
            const actions = permission?.actions ?? [];
            const fields = permission?.allowedUpdateFields ?? [];
            const isActive = actions.length > 0;

            return (
              <Table.Tr key={resource} opacity={isActive ? 1 : 0.6}>
                <Table.Td>
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon
                      size={30}
                      radius="md"
                      variant="light"
                      color={isActive ? "brand" : "gray"}
                    >
                      <Icon size={16} stroke={1.7} />
                    </ThemeIcon>

                    <Stack gap={0} miw={0}>
                      <Text fz="sm" fw={600}>
                        {humanize(resource)}
                      </Text>

                      <Text fz="xs" c="dimmed">
                        {describeActions(actions)}
                      </Text>
                    </Stack>
                  </Group>
                </Table.Td>

                {ACTIONS.map((action) => (
                  <Table.Td key={action}>
                    <Group justify="center">
                      <Mark
                        granted={actions.includes(action)}
                        label={`${humanize(action)} ${resource}`}
                      />
                    </Group>
                  </Table.Td>
                ))}

                <Table.Td ta="center">
                  {actions.includes("update") ? (
                    <Badge
                      size="sm"
                      color={
                        fields.length === catalogFields.length
                          ? "teal"
                          : "brand"
                      }
                      className="numeric"
                    >
                      {fields.length}/{catalogFields.length || fields.length}
                    </Badge>
                  ) : (
                    <Text fz="sm" c="dimmed">
                      —
                    </Text>
                  )}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

export default PermissionSummary;
