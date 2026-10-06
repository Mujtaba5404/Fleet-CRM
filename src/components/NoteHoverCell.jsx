import { Avatar, Group, HoverCard, Stack, Text } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import formatDate from "../utils/formatDate";
import getAbbreviation from "../utils/getAbbreviation";

/**
 * A table cell for free-text notes: one truncated line in the row, and on
 * hover a card with the full note and who wrote it, and when.
 *
 * @param {Object} props
 * @param {string} [props.note]
 * @param {Object|string} [props.author] Populated user (`{ name }`). An
 *   unpopulated id is ignored, and the card falls back to the date alone.
 * @param {string|Date} [props.date]
 * @param {string} [props.emptyText]
 */
const NoteHoverCell = ({ note, author, date, emptyText = "-" }) => {
  if (!note?.trim())
    return (
      <Text size="sm" c="dimmed">
        {emptyText}
      </Text>
    );

  const name = typeof author === "object" ? author?.name : null;

  return (
    <HoverCard width={300} shadow="md" openDelay={150} position="bottom">
      <HoverCard.Target>
        <Text size="sm" truncate style={{ cursor: "default" }}>
          {note}
        </Text>
      </HoverCard.Target>

      <HoverCard.Dropdown p="md">
        <Stack gap="md">
          <Text
            size="sm"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {note}
          </Text>

          <Group gap="sm" wrap="nowrap">
            <Avatar size={40} radius="md" variant="filled" color="dark">
              {name ? getAbbreviation(name) : <IconClock size={18} />}
            </Avatar>

            <Stack gap={0} miw={0}>
              <Text size="sm" fw={600} tt="capitalize" truncate>
                {name || "Last updated"}
              </Text>

              <Text size="xs" c="dimmed">
                {date ? formatDate(date) : "—"}
              </Text>
            </Stack>
          </Group>
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default NoteHoverCell;
