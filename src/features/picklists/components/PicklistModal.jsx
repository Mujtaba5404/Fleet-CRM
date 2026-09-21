import { Badge, Button, Modal, Select, Stack, Switch, TextInput } from "@mantine/core";
import { useCreatePicklistMutation, useUpdatePicklistMutation } from "../../../api/picklist";
import COLORS from "../../../constants/COLORS";
import { usePicklists } from "../../../context/PicklistContext";

const DEFAULT_FIELDS_CONFIG = {
  acronym: false,
  color: true,
  preserveTitleFormatting: true,
  isDefault: true,
  isActive: true,
};

const PicklistModal = ({ children, fieldsConfig = {} }) => {
  const { featureName, scope, resource, field, form, isOpened, closeModal, existingPicklist } = usePicklists();
  const config = { ...DEFAULT_FIELDS_CONFIG, ...fieldsConfig };

  const isEdit = Boolean(existingPicklist?._id);

  const createMutation = useCreatePicklistMutation();
  const updateMutation = useUpdatePicklistMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const handleSubmit = (values) => {
    const payload = { ...values, scope, resource, field };
    const finalPayload = isEdit ? { picklistId: existingPicklist._id, payload } : payload;

    mutation.mutate(finalPayload, {
      onSuccess: () => {
        form.reset();
        closeModal();
      },
    });
  };

  return (
    <Modal title={`${isEdit ? "update" : "create"} ${featureName}`} tt={"capitalize"} opened={isOpened} onClose={closeModal}>
      <Stack component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput required label="title" data-autofocus {...form.getInputProps("title")} />
        {config.color && (
          <Select
            label="color"
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
            required
            label="Acronym"
            description="This acronym will be used in system wherever necessary"
            placeholder="i.e EQ for Equipment"
            tt={"initial"}
            {...form.getInputProps("acronym")}
          />
        )}

        {children}

        {config.preserveTitleFormatting && (
          <Switch label="Preserve title formatting" description="Keeps original casing and spacing" tt={"initial"} {...form.getInputProps("preserveTitleFormatting", { type: "checkbox" })} />
        )}

        {config.isDefault && (
          <Switch label={`Default ${featureName}`} description={`Replaces existing default ${featureName}`} tt={"initial"} {...form.getInputProps("isDefault", { type: "checkbox" })} />
        )}
        {config.isActive && <Switch label="Active" description="Controls visibility and usage" tt={"initial"} {...form.getInputProps("isActive", { type: "checkbox" })} />}

        <Button type="submit" tt={"capitalize"} loading={mutation.isPending}>
          {isEdit ? "update" : "create"} {featureName}
        </Button>
      </Stack>
    </Modal>
  );
};

export default PicklistModal;
