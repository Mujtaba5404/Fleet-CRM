import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreateMaintenanceMutation } from "../../api/maintenance";
import FormShell from "../../components/FormShell";
import {
  MaintenanceAsideFields,
  MaintenanceMainFields,
  MaintenancePhotoFields,
} from "./MaintenanceFormFields";
import {
  MAINTENANCE_INITIAL_VALUES,
  MAINTENANCE_VALIDATION,
  maintenanceToFormData,
  photosForStatus,
} from "./maintenanceForm";
import useConditionPhotos from "./useConditionPhotos";

const AddMaintenanceModal = ({ isOpen = false, onClose = () => {} }) => {
  const createMaintenanceMutation = useCreateMaintenanceMutation();
  const navigate = useNavigate();
  const { photos, setPhotoField, resetPhotos } = useConditionPhotos();

  const form = useForm({
    initialValues: MAINTENANCE_INITIAL_VALUES,
    validate: MAINTENANCE_VALIDATION,
  });

  const handleClose = () => {
    form.reset();
    resetPhotos();
    onClose();
  };

  const handleSubmit = (values) => {
    const payload = maintenanceToFormData(
      values,
      photosForStatus(values.status, photos),
    );

    createMaintenanceMutation.mutate(payload, {
      onSuccess: ({ data }) => {
        form.reset();
        resetPhotos();
        onClose();
        navigate(`/maintenance/${data._id}`);
      },
    });
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Add maintenance"
      description="Record a service job, its checks and the vehicle's condition"
      submitLabel="Add maintenance"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={createMaintenanceMutation.isPending}
      error={createMaintenanceMutation.error}
      aside={
        <>
          <MaintenancePhotoFields
            form={form}
            photos={photos}
            onPhotosChange={setPhotoField}
          />
          <MaintenanceAsideFields form={form} />
        </>
      }
    >
      <MaintenanceMainFields form={form} />
    </FormShell>
  );
};

export default AddMaintenanceModal;
