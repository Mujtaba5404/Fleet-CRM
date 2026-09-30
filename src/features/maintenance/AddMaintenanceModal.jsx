import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreateMaintenanceMutation } from "../../api/maintenance";
import FormShell from "../../components/FormShell";
import {
  MaintenanceAsideFields,
  MaintenanceMainFields,
} from "./MaintenanceFormFields";
import {
  MAINTENANCE_INITIAL_VALUES,
  MAINTENANCE_VALIDATION,
} from "./maintenanceForm";

const AddMaintenanceModal = ({ isOpen = false, onClose = () => {} }) => {
  const createMaintenanceMutation = useCreateMaintenanceMutation();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: MAINTENANCE_INITIAL_VALUES,
    validate: MAINTENANCE_VALIDATION,
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createMaintenanceMutation.mutate(values, {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        navigate(`/maintenance/${data._id}`);
      },
    });
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Log maintenance"
      description="Record a service job, its parts and its checks"
      submitLabel="Log job"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={createMaintenanceMutation.isPending}
      error={createMaintenanceMutation.error}
      aside={<MaintenanceAsideFields form={form} />}
    >
      <MaintenanceMainFields form={form} />
    </FormShell>
  );
};

export default AddMaintenanceModal;
