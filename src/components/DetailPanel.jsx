import { Group, Paper, Text, ThemeIcon } from "@mantine/core";

/**
 * A titled card in the main column of a detail screen.
 */
const DetailPanel = ({ title, icon: Icon, action, children, ...props }) => (
  <Paper p="lg" {...props}>
    <Group justify="space-between" mb="md" wrap="nowrap" gap="sm">
      <Group gap={8} wrap="nowrap" miw={0}>
        {Icon && (
          <ThemeIcon size={26} radius="sm" variant="light">
            <Icon size={15} stroke={1.7} />
          </ThemeIcon>
        )}

        <Text fz="md" fw={650} truncate>
          {title}
        </Text>
      </Group>

      {action}
    </Group>

    {children}
  </Paper>
);

export default DetailPanel;
