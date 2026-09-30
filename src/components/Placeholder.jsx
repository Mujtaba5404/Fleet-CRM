import { Paper, Stack, Text, ThemeIcon } from "@mantine/core";

/**
 * Empty / error state shown in place of a list or panel.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {ReactNode} [props.icon]
 * @param {string} [props.description]
 * @param {ReactNode} [props.action]  e.g. a "Add your first vehicle" button.
 */
const Placeholder = ({ title = "", icon, description, action }) => (
  <Paper w="100%" py={48} px="md">
    <Stack align="center" gap="xs">
      {icon && (
        <ThemeIcon size={64} radius="xl" variant="light" color="gray">
          {icon}
        </ThemeIcon>
      )}

      <Text fz="md" fw={600} ta="center">
        {title}
      </Text>

      {description && (
        <Text fz="sm" c="dimmed" ta="center" maw={420}>
          {description}
        </Text>
      )}

      {action}
    </Stack>
  </Paper>
);

export default Placeholder;
