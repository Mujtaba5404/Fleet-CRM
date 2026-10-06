import { Anchor, Badge, Group, Image, Paper, Stack, Text } from "@mantine/core";
import FormSection from "../../components/FormSection";
import toFileUrl from "../../utils/toFileUrl";
import AttachmentsUpload from "../attachments/AttachmentsUpload";

/** File name from a stored path ("public\uploads\x.png" → "x.png"). */
const fileName = (photo) =>
  (typeof photo === "string" ? photo : photo?.originalName || photo?.filePath)
    ?.split(/[\\/]/)
    .pop() || "Photo";

/**
 * One "vehicle condition" photo set inside a maintenance form: the photos
 * already saved on the job, then a dropzone for new ones.
 *
 * @param {Object}   props
 * @param {string}   props.title
 * @param {string}   props.description
 * @param {Function} props.icon
 * @param {Array}    [props.saved]  Photos already on the job: stored paths
 *   (what the API returns) or attachment objects.
 * @param {File[]}   props.value    Newly picked files.
 * @param {Function} props.onChange
 */
const ConditionPhotosField = ({
  title,
  description,
  icon,
  saved = [],
  value,
  onChange,
}) => {
  const savedPhotos = (saved ?? []).filter((photo) => toFileUrl(photo));
  const count = savedPhotos.length + value.length;

  return (
    <FormSection
      title={title}
      description={description}
      icon={icon}
      plain
      action={
        <Badge size="lg" color={count ? "brand" : "gray"}>
          {count} {count === 1 ? "photo" : "photos"}
        </Badge>
      }
    >
      <Stack gap="sm">
        {savedPhotos.length > 0 && (
          <Stack gap={6}>
            <Text fz="xs" c="dimmed" fw={500}>
              Saved · {savedPhotos.length}
            </Text>

            {/* Same footprint as the new-file previews in AttachmentsUpload. */}
            <Group gap="sm">
              {savedPhotos.map((photo, index) => (
                <Paper key={photo?._id || `${photo}-${index}`} p={4} w={88}>
                  <Anchor
                    href={toFileUrl(photo)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${fileName(photo)}`}
                  >
                    <Image
                      src={toFileUrl(photo)}
                      alt={fileName(photo)}
                      h={56}
                      radius="sm"
                      fit="cover"
                    />
                  </Anchor>

                  <Text fz={10} mt={4} truncate>
                    {fileName(photo)}
                  </Text>

                  <Badge size="xs" color="teal" mt={2}>
                    Saved
                  </Badge>
                </Paper>
              ))}
            </Group>
          </Stack>
        )}

        <AttachmentsUpload value={value} onChange={onChange} />
      </Stack>
    </FormSection>
  );
};

export default ConditionPhotosField;
