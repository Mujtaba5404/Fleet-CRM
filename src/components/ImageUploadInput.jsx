import { ActionIcon, Box, Group, Image, Stack, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhotoPlus, IconX } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { showNotification } from "../notifications/showNotification";
import classes from "./ImageUploadInput.module.css";

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;
const THUMB = 56;

/** A picked `File`, or an already stored image kept as `{ url }` / a plain url. */
const toPreviewUrl = (image) =>
  image instanceof File ? URL.createObjectURL(image) : (image?.url ?? image);

const ImageUploadInput = ({
  value = [],
  onChange = () => {},
  max = 6,
  maxSize = DEFAULT_MAX_SIZE,
  disabled = false,
  ...props
}) => {
  const previews = useMemo(() => value.map(toPreviewUrl), [value]);

  useEffect(
    () => () =>
      previews.forEach((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) URL.revokeObjectURL(url);
      }),
    [previews],
  );

  const handleDrop = (files) => {
    const room = max - value.length;

    if (files.length > room)
      showNotification({
        title: "Too many images",
        message: `Only ${max} images can be attached — the rest were skipped`,
        type: "error",
      });

    onChange([...value, ...files.slice(0, room)]);
  };

  const handleReject = (rejections) =>
    showNotification({
      title: "Image not added",
      message:
        rejections[0]?.errors?.[0]?.code === "file-too-large"
          ? `Each image must be under ${Math.round(maxSize / (1024 * 1024))} MB`
          : "Only image files can be attached",
      type: "error",
    });

  const handleRemove = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <Stack gap="sm">
      <Dropzone
        className={classes.zone}
        onDrop={handleDrop}
        onReject={handleReject}
        accept={IMAGE_MIME_TYPE}
        maxSize={maxSize}
        disabled={disabled || value.length >= max}
        py="xl"
        radius="md"
        style={{
          border: "1px dashed var(--zone-bd)",
          color: "var(--zone-fg)",
        }}
        {...props}
      >
        <Group gap="xs" justify="center" wrap="nowrap">
          <IconPhotoPlus size={22} stroke={1.5} />

          <Text fz="sm" inherit>
            Drop images here or click to upload
          </Text>
        </Group>
      </Dropzone>

      {previews.length > 0 && (
        <Box className={classes.thumbs}>
          {previews.map((url, index) => (
            <Box key={url} className={classes.thumb} pos="relative" w={THUMB} h={THUMB}>
              <Image src={url} alt="" w={THUMB} h={THUMB} fit="cover" radius="md" />

              <ActionIcon
                className={classes.remove}
                size={18}
                radius="xl"
                color="red"
                variant="filled"
                pos="absolute"
                top={-5}
                right={-5}
                disabled={disabled}
                aria-label="Remove image"
                onClick={() => handleRemove(index)}
              >
                <IconX size={11} />
              </ActionIcon>
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  );
};

export default ImageUploadInput;
