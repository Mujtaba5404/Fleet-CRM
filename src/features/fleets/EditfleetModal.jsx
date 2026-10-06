import { Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useUpdatefleetMutation } from "../../api/fleet";
import FormShell from "../../components/FormShell";
import toFormData from "../../utils/toFormData";
import AttachmentsUpload from "../attachments/AttachmentsUpload";
import AttachmentThumbnail from "../attachments/AttachmentThumbnail";
import { FleetAsideFields, FleetMainFields } from "./FleetFormFields";
import { FLEET_VALIDATION, fleetToFormValues } from "./fleetForm";

const EditfleetModal = ({ fleet, isOpen = false, onClose = () => {} }) => {
  const updatefleetMutation = useUpdatefleetMutation();

  // Only newly picked files live here; saved ones are read straight from
  // `fleet.attachments` and deleted individually. The seed is reset during
  // render rather than in an effect, so reopening never flashes the previous
  // session's picks.
  const seed = `${isOpen}:${fleet?._id}`;
  const [attachmentsSeed, setAttachmentsSeed] = useState(seed);
  const [attachments, setAttachments] = useState([]);

  if (attachmentsSeed !== seed) {
    setAttachmentsSeed(seed);
    setAttachments([]);
  }

  const form = useForm({
    initialValues: fleetToFormValues(fleet),
    validate: FLEET_VALIDATION,
  });

  // Refill from the latest record every time the modal opens.
  useEffect(() => {
    if (isOpen && fleet) form.setValues(fleetToFormValues(fleet));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, fleet?._id, fleet?.updatedAt]);

  form.watch("make", ({ value, previousValue }) => {
    if (previousValue && value !== previousValue)
      form.setFieldValue("model", null);
  });

  const handleClose = () => {
    form.reset();
    setAttachments([]);
    onClose();
  };

  const handleSubmit = (values) => {
    updatefleetMutation.mutate(
      { fleetId: fleet._id, payload: toFormData(values, attachments) },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Edit vehicle"
      description={fleet?.licensePlate || "Update this vehicle's details"}
      submitLabel="Save changes"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={updatefleetMutation.isPending}
      error={updatefleetMutation.error}
      aside={<FleetAsideFields form={form} showCurrentOdometer />}
    >
      {fleet?.attachments?.length > 0 && (
        <Group gap="sm">
          {fleet.attachments.map((attachment) => (
            <AttachmentThumbnail key={attachment._id} attachment={attachment} />
          ))}
        </Group>
      )}

      <AttachmentsUpload value={attachments} onChange={setAttachments} />
      <FleetMainFields form={form} />
    </FormShell>
  );
};

export default EditfleetModal;
