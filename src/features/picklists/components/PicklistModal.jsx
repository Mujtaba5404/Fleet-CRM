import {
  Badge,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import {
  useCreatePicklistMutation,
  useUpdatePicklistMutation,
} from "../../../api/picklist";
import COLORS from "../../../constants/COLORS";
import { usePicklists } from "../../../context/PicklistContext";

const DEFAULT_FIELDS_CONFIG = {
  acronym: false,
  color: true,
  preserveTitleFormatting: true,
  isDefault: true,
  isActive: true,
};

/**
 * Picklist entries are a couple of fields, so this stays a small centred modal
 * rather than the full FormShell drawer the record forms use.
 */
const PicklistModal = ({ children, fieldsConfig = {} }) => {
  const {
    featureName,
    scope,
    resource,
    field,
    form,
    isOpened,
    closeModal,
    existingPicklist,
  } = usePicklists();

  const config = { ...DEFAULT_FIELDS_CONFIG, ...fieldsConfig };
  const isEdit = Boolean(existingPicklist?._id);

  const createMutation = useCreatePicklistMutation();
  const updateMutation = useUpdatePicklistMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const handleSubmit = (values) => {
    const payload = { ...values, scope, resource, field };
    const finalPayload = isEdit
      ? { picklistId: existingPicklist._id, payload }
      : payload;

    mutation.mutate(finalPayload, {
      onSuccess: () => {
        form.reset();
        closeModal();
      },
    });
  };

  return (
    <Modal
      opened={isOpened}
      onClose={closeModal}
      title={
        <Stack gap={0}>
          <Text fz="md" fw={650} tt="capitalize">
            {isEdit ? "Edit" : "New"} {featureName}
          </Text>

          <Text fz="xs" c="dimmed">
            {isEdit
              ? "Changes apply everywhere this value is used"
              : "Adds a new option to this dropdown"}
          </Text>
        </Stack>
      }
    >
      <Stack component="form" gap="md" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="Title"
          placeholder={`e.g. a new ${featureName}`}
          data-autofocus
          {...form.getInputProps("title")}
        />

        {config.color && (
          <Select
            label="Colour"
            description="Used for the badge wherever this value appears"
            placeholder="Pick a colour"
            data={Object.values(COLORS)}
            renderOption={({ option }) => (
              <Badge color={option.value} style={{ cursor: "inherit" }}>
                {option.label}
              </Badge>
            )}
            {...form.getInputProps("color")}
          />
        )}

        {config.acronym && (
          <TextInput
            withAsterisk
            label="Acronym"
            description="Used wherever a short form is needed"
            placeholder="i.e. EQ for Equipment"
            {...form.getInputProps("acronym")}
          />
        )}

        {children}

        <Stack gap="sm">
          {config.preserveTitleFormatting && (
            <Switch
              label="Preserve title formatting"
              description="Keeps original casing and spacing"
              {...form.getInputProps("preserveTitleFormatting", {
                type: "checkbox",
              })}
            />
          )}

          {config.isDefault && (
            <Switch
              label={`Default ${featureName}`}
              description={`Replaces the existing default ${featureName}`}
              {...form.getInputProps("isDefault", { type: "checkbox" })}
            />
          )}

          {config.isActive && (
            <Switch
              label="Active"
              description="Controls visibility and usage"
              {...form.getInputProps("isActive", { type: "checkbox" })}
            />
          )}
        </Stack>

        <Group justify="flex-end" gap="sm" mt="xs">
          <Button variant="default" onClick={closeModal}>
            Cancel
          </Button>

          <Button type="submit" loading={mutation.isPending}>
            {isEdit ? "Save changes" : "Create"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default PicklistModal;
