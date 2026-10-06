import {
  Image,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { IconPhotoOff } from "@tabler/icons-react";
import { useState } from "react";
import toFileUrl from "../../utils/toFileUrl";

const photoSrc = toFileUrl;

const PhotoGrid = ({ label, photos, emptyText, onOpen }) => (
  <Stack gap="xs">
    <Text fz="xs" fw={600} c="dimmed" tt="uppercase" lts="0.04em">
      {label} · {photos.length}
    </Text>

    {photos.length ? (
      <SimpleGrid cols={{ base: 3, sm: 4 }} spacing="xs">
        {photos.map((photo, index) => (
          <UnstyledButton
            key={photo?._id || index}
            onClick={() => onOpen(photo)}
            aria-label={`Open ${label.toLowerCase()} photo ${index + 1}`}
          >
            <Image
              src={photoSrc(photo)}
              alt={photo?.originalName || `${label} photo`}
              h={84}
              radius="md"
              fit="cover"
              style={{
                border: "1px solid var(--mantine-color-default-border)",
              }}
            />
          </UnstyledButton>
        ))}
      </SimpleGrid>
    ) : (
      <Stack
        align="center"
        gap={6}
        py="lg"
        style={{
          border: "1px dashed var(--mantine-color-default-border)",
          borderRadius: "var(--mantine-radius-md)",
        }}
      >
        <ThemeIcon size={36} radius="xl" variant="light" color="gray">
          <IconPhotoOff size={18} />
        </ThemeIcon>

        <Text fz="xs" c="dimmed" ta="center" px="sm">
          {emptyText}
        </Text>
      </Stack>
    )}
  </Stack>
);

/** Before and after service photos side by side, each opening full size. */
const ConditionGallery = ({ before = [], after = [], completed = false }) => {
  const [preview, setPreview] = useState(null);

  return (
    <>
      <Modal
        opened={!!preview}
        onClose={() => setPreview(null)}
        size="xl"
        title={preview?.originalName || "Photo"}
      >
        {preview && (
          <Image
            src={photoSrc(preview)}
            alt={preview?.originalName || "Condition photo"}
            radius="md"
            fit="contain"
            mah="75vh"
          />
        )}
      </Modal>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <PhotoGrid
          label="Before"
          photos={before}
          emptyText="No photos taken when the vehicle came in"
          onOpen={setPreview}
        />

        <PhotoGrid
          label="After"
          photos={after}
          emptyText={
            completed
              ? "No photos taken after the service"
              : "Added when the job is marked completed"
          }
          onOpen={setPreview}
        />
      </SimpleGrid>
    </>
  );
};

export default ConditionGallery;
