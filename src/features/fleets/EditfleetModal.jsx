import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdatefleetMutation } from "../../api/fleet";
import FormShell from "../../components/FormShell";
import { FleetAsideFields, FleetMainFields } from "./FleetFormFields";
import { FLEET_VALIDATION, fleetToFormValues } from "./fleetForm";

const EditfleetModal = ({ fleet, isOpen = false, onClose = () => {} }) => {
  const updatefleetMutation = useUpdatefleetMutation();

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
    onClose();
  };

  const handleSubmit = (values) => {
    updatefleetMutation.mutate(
      { fleetId: fleet._id, payload: values },
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
      <FleetMainFields form={form} />
    </FormShell>
  );
};

export default EditfleetModal;
