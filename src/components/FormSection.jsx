import {
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";

/**
 * A titled card holding one group of form fields.
 *
 * Icon, title and one-line description sit above a full-width hairline, then
 * the fields. Grouping into cards (rather than flat headings on the modal
 * background) is what keeps a long form readable — each card is one decision.
 *
 * Children are Grid.Col elements. Pass `plain` for content that is not a
 * field grid, such as a repeater list or a totals block.
 */
const FormSection = ({
  title,
  description,
  icon: Icon,
  action,
  plain = false,
  children,
}) => (
  <Paper p="md" radius="md">
    <Group gap="sm" align="flex-start" wrap="nowrap">
      {Icon && (
        <ThemeIcon size={32} radius="md" variant="light">
          <Icon size={17} stroke={1.7} />
        </ThemeIcon>
      )}

      <Stack gap={1} miw={0} flex={1}>
        <Text fz="sm" fw={600} lh={1.35}>
          {title}
        </Text>

        {description && (
          <Text fz="xs" c="dimmed" lh={1.4}>
            {description}
          </Text>
        )}
      </Stack>

      {action}
    </Group>

    <Divider my="md" />

    {plain ? (
      children
    ) : (
      <Grid align="flex-start" gutter="sm">
        {children}
      </Grid>
    )}
  </Paper>
);

export default FormSection;
