import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useUpdatefleetMutation } from "../../api/fleet";
import FormShell from "../../components/FormShell";
import {
  FleetAsideFields,
  FleetFilesFields,
  FleetMainFields,
} from "./FleetFormFields";
import {
  EMPTY_FLEET_FILES,
  FLEET_VALIDATION,
  fleetToPayload,
  fleetToFormValues,
} from "./fleetForm";

const EditfleetModal = ({ fleet, isOpen = false, onClose = () => {} }) => {
  const updatefleetMutation = useUpdatefleetMutation();

  // Only newly picked files live here; saved ones are read straight from
  // `fleet.images` / `fleet.documents`. The seed is reset during render
  // rather than in an effect, so reopening never flashes the previous
  // session's picks.
  const seed = `${isOpen}:${fleet?._id}`;
  const [filesSeed, setFilesSeed] = useState(seed);
  const [files, setFiles] = useState(EMPTY_FLEET_FILES);

  if (filesSeed !== seed) {
    setFilesSeed(seed);
    setFiles(EMPTY_FLEET_FILES);
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
    setFiles(EMPTY_FLEET_FILES);
    onClose();
  };

  const handleSubmit = (values) => {
    updatefleetMutation.mutate(
      { fleetId: fleet._id, payload: fleetToPayload(values, files) },
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
      aside={
        <>
          <FleetAsideFields form={form} showCurrentOdometer />
          <FleetFilesFields files={files} onChange={setFiles} saved={fleet} />
        </>
      }
    >
      <FleetMainFields form={form} />
    </FormShell>
  );
};

export default EditfleetModal;
