import { Divider, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";

/**
 * A titled card on a detail screen.
 *
 * All four detail screens had their own `PanelHeader`; this is the shared one.
 */
const DetailPanel = ({ title, icon: Icon, action, children, ...props }) => (
  <Paper p="md" {...props}>
    <Group justify="space-between" mb="sm" wrap="nowrap" gap="sm">
      <Group gap={8} wrap="nowrap" miw={0}>
        {Icon && (
          <ThemeIcon size={26} radius="sm" variant="light">
            <Icon size={15} stroke={1.7} />
          </ThemeIcon>
        )}

        <Text fz="sm" fw={650} truncate>
          {title}
        </Text>
      </Group>

      {action}
    </Group>

    {children}
  </Paper>
);

/**
 * A label / value pair. Strings render as text, anything else (badges, links)
 * is rendered as given.
 */
const Field = ({ label, children, fallback = "—", numeric = false }) => {
  const content = children ?? fallback;

  return (
    <Stack gap={2} miw={0}>
      <Text fz="xs" c="dimmed" fw={500}>
        {label}
      </Text>

      {typeof content === "string" || typeof content === "number" ? (
        <Text
          fz="sm"
          fw={500}
          tt={numeric ? undefined : "capitalize"}
          className={numeric ? "numeric" : undefined}
        >
          {content}
        </Text>
      ) : (
        content
      )}
    </Stack>
  );
};

/** Fields stacked vertically with hairlines between them. */
const FieldList = ({ children }) => {
  const items = Array.isArray(children) ? children.filter(Boolean) : [children];

  return (
    <Stack gap="sm">
      {items.map((item, index) => (
        <div key={index}>
          {item}
          {index !== items.length - 1 && <Divider mt="sm" />}
        </div>
      ))}
    </Stack>
  );
};

Field.displayName = "DetailPanel.Field";
FieldList.displayName = "DetailPanel.FieldList";

DetailPanel.Field = Field;
DetailPanel.FieldList = FieldList;

export default DetailPanel;
