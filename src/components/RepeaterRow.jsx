import { ActionIcon, Box, Group, Paper, Text, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

/**
 * One entry in a repeating field group (parts, checklist rows).
 *
 * The index sits in a chip on the left rather than in a "Part 1" caption
 * above, which keeps each row one line shorter — it adds up over a long list.
 */
const RepeaterRow = ({ index, onRemove, canRemove = true, children }) => (
  <Paper p="sm" radius="md">
    <Group align="flex-start" wrap="nowrap" gap="sm">
      <Text
        fz="xs"
        fw={600}
        c="dimmed"
        mt={28}
        w={18}
        ta="center"
        style={{ flexShrink: 0 }}
      >
        {index + 1}
      </Text>

      <Box flex={1} miw={0}>
        {children}
      </Box>

      <Tooltip label="Remove" withArrow>
        <ActionIcon
          color="red"
          mt={28}
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove row ${index + 1}`}
          style={{ flexShrink: 0 }}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Tooltip>
    </Group>
  </Paper>
);

export default RepeaterRow;
