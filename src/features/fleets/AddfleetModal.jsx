import { useForm } from "@mantine/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatefleetMutation } from "../../api/fleet";
import FormShell from "../../components/FormShell";
import AttachmentsUpload from "../attachments/AttachmentsUpload";
import { FleetAsideFields, FleetMainFields } from "./FleetFormFields";
import {
  FLEET_INITIAL_VALUES,
  FLEET_VALIDATION,
  fleetToFormData,
} from "./fleetForm";

const AddfleetModal = ({ isOpen = false, onClose = () => {} }) => {
  const createfleetMutation = useCreatefleetMutation();
  const navigate = useNavigate();

  // Held outside the form: Files are not form values, they are appended to
  // the multipart body on submit.
  const [attachments, setAttachments] = useState([]);

  const form = useForm({
    initialValues: FLEET_INITIAL_VALUES,
    validate: FLEET_VALIDATION,
  });

  form.watch("make", ({ value, previousValue }) => {
    if (value !== previousValue) form.setFieldValue("model", null);
  });

  const handleClose = () => {
    form.reset();
    setAttachments([]);
    onClose();
  };

  const handleSubmit = (values) => {
    createfleetMutation.mutate(fleetToFormData(values, attachments), {
      onSuccess: ({ data }) => {
        form.reset();
        setAttachments([]);
        onClose();
        navigate(`/fleets/${data._id}`);
      },
    });
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Add vehicle"
      description="Register a new vehicle in your fleet"
      submitLabel="Add vehicle"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={createfleetMutation.isPending}
      error={createfleetMutation.error}
      aside={<FleetAsideFields form={form} />}
    >
      <AttachmentsUpload value={attachments} onChange={setAttachments} />
      <FleetMainFields form={form} />
    </FormShell>
  );
};

export default AddfleetModal;
