import {
  ActionIcon,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconFileFilled, IconPhotoPlus, IconX } from "@tabler/icons-react";
import { useMemo } from "react";
import formatBytes from "src/utils/formatBytes";

const PREVIEW_WIDTH = 88;
const PREVIEW_HEIGHT = 56;

const FilePreview = ({ file, onRemove }) => {
  // Memoised so a re-render does not mint a fresh blob URL every time.
  const src = useMemo(
    () => (file.type.startsWith("image/") ? URL.createObjectURL(file) : null),
    [file],
  );

  return (
    <Paper p={4} w={PREVIEW_WIDTH} pos="relative" title={file.name}>
      {src ? (
        <Image
          src={src}
          alt={file.name}
          h={PREVIEW_HEIGHT}
          radius="sm"
          fit="cover"
        />
      ) : (
        <ThemeIcon
          h={PREVIEW_HEIGHT}
          w="100%"
          radius="sm"
          variant="light"
          color="gray"
        >
          <IconFileFilled size={22} />
        </ThemeIcon>
      )}

      <Text fz={10} mt={4} truncate>
        {file.name}
      </Text>

      <Text fz={10} c="dimmed">
        {formatBytes(file.size)}
      </Text>

      <Tooltip label="Remove">
        <ActionIcon
          size={18}
          radius="xl"
          variant="filled"
          color="red"
          pos="absolute"
          top={-6}
          right={-6}
          onClick={onRemove}
          aria-label={`Remove ${file.name}`}
        >
          <IconX size={10} />
        </ActionIcon>
      </Tooltip>
    </Paper>
  );
};

/**
 * Image picker: a drop area, with the picked files listed underneath it.
 *
 * The list must live outside the Dropzone. Mantine's Dropzone sets
 * `pointer-events: none` on its content, so a remove button placed inside it
 * can never be clicked.
 */
const AttachmentsUpload = ({ value = [], onChange }) => {
  const handleDrop = (files) => onChange?.([...value, ...files]);

  const removeFile = (index) => onChange?.(value.filter((_, i) => i !== index));

  return (
    <Stack gap="sm">
      <Dropzone accept={IMAGE_MIME_TYPE} multiple onDrop={handleDrop} p="md">
        <Stack align="center" justify="center" gap={4} mih={90}>
          <IconPhotoPlus size={34} stroke={1.25} />

          <Text size="sm">Drag images here or click to upload</Text>

          <Text size="xs" c="dimmed">
            You can add several at once
          </Text>
        </Stack>
      </Dropzone>

      {value.length > 0 && (
        <Group gap="sm" pt={6}>
          {value.map((file, index) => (
            <FilePreview
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </Group>
      )}
    </Stack>
  );
};

export default AttachmentsUpload;
