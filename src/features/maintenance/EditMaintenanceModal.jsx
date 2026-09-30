import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdateMaintenanceMutation } from "../../api/maintenance";
import FormShell from "../../components/FormShell";
import {
  MaintenanceAsideFields,
  MaintenanceMainFields,
} from "./MaintenanceFormFields";
import {
  MAINTENANCE_VALIDATION,
  maintenanceToFormValues,
} from "./maintenanceForm";

const EditMaintenanceModal = ({
  maintenance,
  isOpen = false,
  onClose = () => {},
}) => {
  const updateMaintenanceMutation = useUpdateMaintenanceMutation();

  const form = useForm({
    initialValues: maintenanceToFormValues(maintenance),
    validate: MAINTENANCE_VALIDATION,
  });

  // Refill from the latest record every time the drawer opens.
  useEffect(() => {
    if (isOpen && maintenance)
      form.setValues(maintenanceToFormValues(maintenance));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, maintenance?._id, maintenance?.updatedAt]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    updateMaintenanceMutation.mutate(
      { maintenanceId: maintenance._id, payload: values },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Edit maintenance"
      description={
        maintenance?.type?.title || "Update this service job's details"
      }
      submitLabel="Save changes"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={updateMaintenanceMutation.isPending}
      error={updateMaintenanceMutation.error}
      aside={<MaintenanceAsideFields form={form} />}
    >
      <MaintenanceMainFields form={form} />
    </FormShell>
  );
};

export default EditMaintenanceModal;
