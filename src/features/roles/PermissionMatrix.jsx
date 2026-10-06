import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Group,
  Menu,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChevronDown,
  IconEye,
  IconEraser,
  IconShieldCheck,
  IconShieldLock,
  IconWand,
} from "@tabler/icons-react";
import { useState } from "react";
import FormSection from "../../components/FormSection";
import classes from "./PermissionMatrix.module.css";
import {
  ACTIONS,
  describeActions,
  EMPTY_PERMISSION,
  humanize,
  nextActions,
} from "./roleForm";

const PermissionRow = ({ entry, permission, onChange }) => {
  const [expanded, setExpanded] = useState(false);
  const { resource, icon: Icon, fields: catalogFields } = entry;
  const { actions, fields } = permission;

  const isActive = actions.length > 0;
  const canUpdate = actions.includes("update");
  const hasFields = catalogFields.length > 0;

  const toggle = (action, checked) => {
    const actionsAfter = nextActions(actions, action, checked);
    const gainsUpdate = actionsAfter.includes("update") && !canUpdate;

    // First time update is granted, start from "every field" rather than
    // leaving the role able to update a record but none of its fields.
    onChange({
      actions: actionsAfter,
      fields: gainsUpdate && !fields.length ? catalogFields : fields,
    });

    if (gainsUpdate && hasFields) setExpanded(true);
  };

  return (
    <div className={classes.row} data-active={isActive || undefined}>
      <div className={classes.rowMain}>
        <div className={classes.resource}>
          <ThemeIcon
            className={classes.resourceIcon}
            size={32}
            radius="md"
            variant="light"
            color={isActive ? "brand" : "gray"}
          >
            <Icon size={17} stroke={1.7} />
          </ThemeIcon>

          <Stack gap={0} miw={0}>
            <Text fz="sm" fw={600} truncate>
              {humanize(resource)}
            </Text>

            <Text fz="xs" c="dimmed" truncate>
              {describeActions(actions)}
              {canUpdate &&
                hasFields &&
                ` · ${fields.length}/${catalogFields.length} fields`}
            </Text>
          </Stack>
        </div>

        {ACTIONS.map((action) => (
          <div key={action} className={classes.cell}>
            <Checkbox
              aria-label={`${humanize(action)} ${resource}`}
              checked={actions.includes(action)}
              onChange={(event) => toggle(action, event.currentTarget.checked)}
            />
          </div>
        ))}

        <div className={classes.cell}>
          {hasFields && (
            <Tooltip label={expanded ? "Hide fields" : "Editable fields"}>
              <ActionIcon
                size="sm"
                color="gray"
                onClick={() => setExpanded((open) => !open)}
                aria-label={`Editable fields for ${resource}`}
                aria-expanded={expanded}
              >
                <IconChevronDown
                  size={16}
                  className={classes.chevron}
                  data-open={expanded || undefined}
                />
              </ActionIcon>
            </Tooltip>
          )}
        </div>
      </div>

      {hasFields && (
        <Collapse expanded={expanded}>
          <div className={classes.fields}>
            <Group justify="space-between" mb={8} gap="xs">
              <Text fz="xs" fw={600} c="dimmed" tt="uppercase" lts="0.04em">
                Editable fields
              </Text>

              {canUpdate && (
                <Group gap="sm">
                  <Anchor
                    component="button"
                    type="button"
                    fz="xs"
                    onClick={() => onChange({ actions, fields: catalogFields })}
                  >
                    Select all
                  </Anchor>

                  <Anchor
                    component="button"
                    type="button"
                    fz="xs"
                    c="dimmed"
                    onClick={() => onChange({ actions, fields: [] })}
                  >
                    None
                  </Anchor>
                </Group>
              )}
            </Group>

            {!canUpdate && (
              <Text fz="xs" c="dimmed" mb={8}>
                Grant Update to choose which of these fields the role may
                change.
              </Text>
            )}

            <Chip.Group
              multiple
              value={fields}
              onChange={(value) => onChange({ actions, fields: value })}
            >
              <Group gap={6}>
                {catalogFields.map((field) => (
                  <Chip
                    key={field}
                    value={field}
                    size="xs"
                    variant="light"
                    disabled={!canUpdate}
                  >
                    {humanize(field)}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </div>
        </Collapse>
      )}
    </div>
  );
};

/**
 * Resource × action grid for a role form, with per-resource field narrowing.
 *
 * @param {Object} props
 * @param {Object} props.form     Mantine form holding `permissions`.
 * @param {Array}  props.catalog  From `usePermissionCatalog`.
 */
const PermissionMatrix = ({ form, catalog }) => {
  const permissions = form.values.permissions;
  const get = (resource) => permissions[resource] ?? EMPTY_PERMISSION;

  const setAll = (next) => {
    form.setFieldValue("permissions", next);
    form.clearFieldError("permissions");
  };

  const setOne = (resource, value) =>
    setAll({ ...permissions, [resource]: value });

  const columnState = (action) => {
    const count = catalog.filter((entry) =>
      get(entry.resource).actions.includes(action),
    ).length;

    return {
      checked: count > 0 && count === catalog.length,
      indeterminate: count > 0 && count < catalog.length,
    };
  };

  const toggleColumn = (action, checked) =>
    setAll(
      Object.fromEntries(
        catalog.map((entry) => {
          const current = get(entry.resource);
          const actions = nextActions(current.actions, action, checked);
          const gainsUpdate =
            actions.includes("update") && !current.actions.includes("update");

          return [
            entry.resource,
            {
              actions,
              fields:
                gainsUpdate && !current.fields.length
                  ? entry.fields
                  : current.fields,
            },
          ];
        }),
      ),
    );

  const applyPreset = (preset) =>
    setAll(
      Object.fromEntries(
        catalog.map((entry) => {
          const current = get(entry.resource);

          if (preset === "full")
            return [entry.resource, { actions: ACTIONS, fields: entry.fields }];

          if (preset === "read")
            return [
              entry.resource,
              { actions: ["read"], fields: current.fields },
            ];

          return [entry.resource, { actions: [], fields: current.fields }];
        }),
      ),
    );

  const granted = catalog.reduce(
    (sum, entry) => sum + get(entry.resource).actions.length,
    0,
  );
  const total = catalog.length * ACTIONS.length;

  return (
    <FormSection
      title="Permissions"
      description="What this role can do with each resource. Read is included with any other action."
      icon={IconShieldLock}
      plain
      action={
        <Group gap="xs" wrap="nowrap">
          <Badge
            variant="light"
            color={granted ? "brand" : "gray"}
            className="numeric"
          >
            {granted}/{total}
          </Badge>

          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <Button
                size="xs"
                variant="default"
                leftSection={<IconWand size={14} />}
              >
                Presets
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconShieldCheck size={16} />}
                onClick={() => applyPreset("full")}
              >
                Full access to everything
              </Menu.Item>

              <Menu.Item
                leftSection={<IconEye size={16} />}
                onClick={() => applyPreset("read")}
              >
                Read only, everything
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                color="red"
                leftSection={<IconEraser size={16} />}
                onClick={() => applyPreset("clear")}
              >
                Clear all
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      }
    >
      <Stack gap="sm">
        <div className={classes.matrix}>
          <div className={classes.head}>
            <Text fz="xs" fw={600} c="dimmed" tt="uppercase" lts="0.04em">
              Resource
            </Text>

            {ACTIONS.map((action) => (
              <div key={action} className={classes.headCell}>
                <Tooltip label={`Toggle ${action} for every resource`}>
                  <Checkbox
                    size="xs"
                    aria-label={`${humanize(action)} on every resource`}
                    {...columnState(action)}
                    onChange={(event) =>
                      toggleColumn(action, event.currentTarget.checked)
                    }
                  />
                </Tooltip>

                <Text fz={10} fw={600} c="dimmed" tt="uppercase" lts="0.04em">
                  {action}
                </Text>
              </div>
            ))}

            <span />
          </div>

          {catalog.map((entry) => (
            <PermissionRow
              key={entry.resource}
              entry={entry}
              permission={get(entry.resource)}
              onChange={(value) => setOne(entry.resource, value)}
            />
          ))}
        </div>

        {form.errors.permissions && (
          <Alert color="red" icon={<IconAlertCircle size={16} />} py="xs">
            {form.errors.permissions}
          </Alert>
        )}
      </Stack>
    </FormSection>
  );
};

export default PermissionMatrix;
