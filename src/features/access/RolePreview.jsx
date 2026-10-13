import { Badge, Group, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { IconBox } from "@tabler/icons-react";
import {
  ACTIONS,
  describeActions,
  humanize,
  RESOURCE_CATALOG,
} from "../roles/roleForm";

const iconFor = (resource) =>
  RESOURCE_CATALOG.find((entry) => entry.resource === resource)?.icon ??
  IconBox;

/** What a role lets its users see and do, one chip per resource. */
const RolePreview = ({ role }) => {
  const granted = (role?.permissions ?? [])
    .map(({ resource, actions = [] }) => ({
      resource,
      actions: ACTIONS.filter((action) => actions.includes(action)),
    }))
    .filter(({ actions }) => actions.length);

  return (
    <Paper p="sm" withBorder>
      <Stack gap={8}>
        <Text fz="xs" c="dimmed" fw={500}>
          {granted.length
            ? `This user will be able to use ${granted.length} ${granted.length === 1 ? "resource" : "resources"}`
            : "This role grants no access yet"}
        </Text>

        {granted.length > 0 && (
          <Group gap={6} wrap="wrap">
            {granted.map(({ resource, actions }) => {
              const Icon = iconFor(resource);

              return (
                <Tooltip
                  key={resource}
                  label={`${describeActions(actions)} · ${actions.join(", ")}`}
                  withArrow
                >
                  <Badge
                    variant="light"
                    tt="none"
                    fw={500}
                    leftSection={<Icon size={12} />}
                    style={{ cursor: "default" }}
                  >
                    {humanize(resource)}
                  </Badge>
                </Tooltip>
              );
            })}
          </Group>
        )}
      </Stack>
    </Paper>
  );
};

export default RolePreview;
