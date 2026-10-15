import {
  Anchor,
  Badge,
  Center,
  HoverCard,
  Image,
  SimpleGrid,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import toFileUrl from "../../utils/toFileUrl";

const IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i;

const fileName = (file) =>
  (typeof file === "string" ? file : file?.originalName || file?.filePath || "")
    .split(/[\\/]/)
    .pop() || "File";

// Documents accept images too, so decide by mime type or extension.
const isImage = (file) =>
  file?.mimeType?.startsWith?.("image/") ||
  file?.mimetype?.startsWith?.("image/") ||
  IMAGE_EXTENSION.test(fileName(file));

const THUMB = { w: 64, h: 48 };

const Thumbnail = ({ file }) => {
  const url = toFileUrl(file);
  const name = fileName(file);

  return (
    <Tooltip label={name} withinPortal>
      <Anchor href={url} target="_blank" rel="noreferrer">
        {isImage(file) ? (
          <Image src={url} alt={name} {...THUMB} radius="sm" fit="cover" />
        ) : (
          <Center
            {...THUMB}
            bg="var(--mantine-color-default-hover)"
            style={{ borderRadius: "var(--mantine-radius-sm)" }}
          >
            <IconFileText size={22} />
          </Center>
        )}
      </Anchor>
    </Tooltip>
  );
};

/** Files count for a fleet row; hovering shows small previews of each file. */
const FleetFilesPreview = ({ images = [], documents = [] }) => {
  const files = [...images, ...documents].filter((file) => toFileUrl(file));

  if (!files.length) {
    return (
      <Text size="sm" c="dimmed">
        -
      </Text>
    );
  }

  return (
    <HoverCard width={240} shadow="md" openDelay={150} withinPortal>
      <HoverCard.Target>
        <Badge variant="light" color="gray" style={{ cursor: "pointer" }}>
          {files.length}
        </Badge>
      </HoverCard.Target>

      <HoverCard.Dropdown p="xs">
        <SimpleGrid cols={3} spacing={6} verticalSpacing={6}>
          {files.map((file, index) => (
            <Thumbnail key={index} file={file} />
          ))}
        </SimpleGrid>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default FleetFilesPreview;
