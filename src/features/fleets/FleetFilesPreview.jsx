import {
  Anchor,
  Badge,
  Center,
  Group,
  HoverCard,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import toFileUrl from "../../utils/toFileUrl";
import { fileName, fleetFiles, isImage } from "./fleetFileUtils";

const MAX_THUMBS = 3;
const SIZE = 36;

const thumbStyle = {
  borderRadius: "var(--mantine-radius-sm)",
  border: "1px solid var(--mantine-color-default-border)",
};

const Thumbnail = ({ file }) => {
  const url = toFileUrl(file);
  const name = fileName(file);

  return (
    <Tooltip label={name} withinPortal>
      <Anchor href={url} target="_blank" rel="noreferrer" display="block">
        {isImage(file) ? (
          <Image
            src={url}
            alt={name}
            w={SIZE}
            h={SIZE}
            fit="cover"
            style={thumbStyle}
          />
        ) : (
          <Center
            w={SIZE}
            h={SIZE}
            bg="var(--mantine-color-default-hover)"
            c="dimmed"
            style={thumbStyle}
          >
            <IconFileText size={16} />
          </Center>
        )}
      </Anchor>
    </Tooltip>
  );
};

/**
 * A fleet row's file count. Hovering it shows the first few files; the rest
 * are a link to the vehicle's files section.
 */
const FleetFilesPreview = ({ fleet }) => {
  const files = fleetFiles(fleet);

  if (!files.length) {
    return (
      <Text size="sm" c="dimmed">
        -
      </Text>
    );
  }

  const hidden = files.length - MAX_THUMBS;

  return (
    <HoverCard shadow="md" openDelay={150} withinPortal>
      <HoverCard.Target>
        <Badge variant="light" color="gray" style={{ cursor: "pointer" }}>
          {files.length}
        </Badge>
      </HoverCard.Target>

      <HoverCard.Dropdown p="xs">
        <Stack gap={6}>
          <Group gap={4} wrap="nowrap">
            {files.slice(0, MAX_THUMBS).map((file, index) => (
              <Thumbnail key={index} file={file} />
            ))}
          </Group>

          {hidden > 0 && (
            <Anchor
              component={Link}
              to={`/fleets/${fleet._id}#files`}
              fz="xs"
              ta="center"
            >
              View all {files.length} files
            </Anchor>
          )}
        </Stack>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default FleetFilesPreview;
