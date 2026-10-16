import {
  ActionIcon,
  Anchor,
  Badge,
  Group,
  Image,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconExternalLink,
  IconFile,
  IconFileSpreadsheet,
  IconFileText,
  IconFileTypePdf,
  IconPaperclip,
  IconPhoto,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import DetailPanel from "../../components/DetailPanel";
import toFileUrl from "../../utils/toFileUrl";
import { fileExtension, fileName, fleetFiles, isImage } from "./fleetFileUtils";

const DOCUMENT_ICONS = {
  pdf: { icon: IconFileTypePdf, color: "red" },
  doc: { icon: IconFileText, color: "blue" },
  docx: { icon: IconFileText, color: "blue" },
  xls: { icon: IconFileSpreadsheet, color: "green" },
  xlsx: { icon: IconFileSpreadsheet, color: "green" },
  csv: { icon: IconFileSpreadsheet, color: "green" },
};

const SectionTitle = ({ icon: Icon, label, count }) => (
  <Group gap={6} mb="xs">
    <Icon size={16} stroke={1.7} color="var(--mantine-color-dimmed)" />
    <Text fz="sm" fw={600}>
      {label}
    </Text>
    <Badge size="sm" variant="light" color="gray" circle>
      {count}
    </Badge>
  </Group>
);

/** Full-size view of one image, stepping through the rest with arrows. */
const ImageViewer = ({ images, index, onChange, onClose }) => {
  const opened = index != null;
  const image = opened ? images[index] : null;
  const many = images.length > 1;

  const step = (delta) =>
    onChange((index + delta + images.length) % images.length);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      centered
      title={
        image && (
          <Text fw={600} truncate maw={480}>
            {fileName(image)}
          </Text>
        )
      }
    >
      {image && (
        <Stack gap="sm">
          <Image
            src={toFileUrl(image)}
            alt={fileName(image)}
            mah="70vh"
            fit="contain"
            radius="sm"
          />

          <Group justify="space-between">
            <Group gap="xs">
              {many && (
                <>
                  <ActionIcon
                    variant="default"
                    aria-label="Previous image"
                    onClick={() => step(-1)}
                  >
                    <IconChevronLeft size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="default"
                    aria-label="Next image"
                    onClick={() => step(1)}
                  >
                    <IconChevronRight size={16} />
                  </ActionIcon>
                </>
              )}
              <Text fz="xs" c="dimmed">
                {index + 1} of {images.length}
              </Text>
            </Group>

            <Anchor
              href={toFileUrl(image)}
              target="_blank"
              rel="noreferrer"
              fz="sm"
            >
              <Group gap={4}>
                <IconExternalLink size={14} />
                Open original
              </Group>
            </Anchor>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};

const DocumentRow = ({ file }) => {
  const url = toFileUrl(file);
  const extension = fileExtension(file);
  const { icon: Icon, color } = DOCUMENT_ICONS[extension] ?? {
    icon: IconFile,
    color: "gray",
  };

  return (
    <Paper withBorder p="xs" radius="md">
      <Group gap="sm" wrap="nowrap">
        <ThemeIcon size={36} radius="md" variant="light" color={color}>
          <Icon size={20} stroke={1.6} />
        </ThemeIcon>

        <Stack gap={0} miw={0} style={{ flex: 1 }}>
          <Anchor
            href={url}
            target="_blank"
            rel="noreferrer"
            fz="sm"
            fw={500}
            c="inherit"
            truncate
          >
            {fileName(file)}
          </Anchor>
          <Text fz="xs" c="dimmed" tt="uppercase">
            {extension || "File"}
          </Text>
        </Stack>

        <Tooltip label="Download" withinPortal>
          <ActionIcon
            component="a"
            href={url}
            download
            target="_blank"
            rel="noreferrer"
            variant="subtle"
            color="gray"
            aria-label="Download"
          >
            <IconDownload size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
};

/**
 * The vehicle's photos as a gallery and its paperwork as a list. The table's
 * "view all" link lands here via `#files`.
 */
const FleetFiles = ({ fleet }) => {
  const files = fleetFiles(fleet);
  // Documents can be images too; those belong in the gallery.
  const images = files.filter(isImage);
  const documents = files.filter((file) => !isImage(file));

  const [viewing, setViewing] = useState(null);

  const ref = useRef(null);
  const { hash } = useLocation();
  useEffect(() => {
    if (hash === "#files")
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  if (!files.length) return null;

  return (
    <div ref={ref} id="files" style={{ scrollMarginTop: 80 }}>
      <DetailPanel title="Files" icon={IconPaperclip} mt="lg">
        <Stack gap="lg">
          {images.length > 0 && (
            <div>
              <SectionTitle
                icon={IconPhoto}
                label="Images"
                count={images.length}
              />

              <Group gap="xs">
                {images.map((image, index) => (
                  <UnstyledButton
                    key={index}
                    onClick={() => setViewing(index)}
                    aria-label={`View ${fileName(image)}`}
                  >
                    <Image
                      src={toFileUrl(image)}
                      alt={fileName(image)}
                      w={96}
                      h={72}
                      radius="sm"
                      fit="cover"
                      style={{
                        border: "1px solid var(--mantine-color-default-border)",
                      }}
                    />
                  </UnstyledButton>
                ))}
              </Group>
            </div>
          )}

          {documents.length > 0 && (
            <div>
              <SectionTitle
                icon={IconFileText}
                label="Documents"
                count={documents.length}
              />

              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
                {documents.map((document, index) => (
                  <DocumentRow key={index} file={document} />
                ))}
              </SimpleGrid>
            </div>
          )}
        </Stack>

        <ImageViewer
          images={images}
          index={viewing}
          onChange={setViewing}
          onClose={() => setViewing(null)}
        />
      </DetailPanel>
    </div>
  );
};

export default FleetFiles;
