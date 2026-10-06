import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdateMaintenanceMutation } from "../../api/maintenance";
import FormShell from "../../components/FormShell";
import ENUMS from "../../constants/ENUMS";
import {
  MaintenanceAsideFields,
  MaintenanceMainFields,
  MaintenancePhotoFields,
} from "./MaintenanceFormFields";
import {
  MAINTENANCE_VALIDATION,
  maintenanceToFormData,
  maintenanceToFormValues,
  photosForStatus,
} from "./maintenanceForm";
import useConditionPhotos from "./useConditionPhotos";

/**
 * @param {Object}  props
 * @param {Object}  props.maintenance
 * @param {boolean} [props.completing] Open pre-set to Completed (with today as
 *   the end date), for the "Mark completed" action.
 */
const EditMaintenanceModal = ({
  maintenance,
  isOpen = false,
  onClose = () => {},
  completing = false,
}) => {
  const updateMaintenanceMutation = useUpdateMaintenanceMutation();
  const { photos, setPhotoField, resetPhotos } = useConditionPhotos(
    `${isOpen}:${maintenance?._id}`,
  );

  const form = useForm({
    initialValues: maintenanceToFormValues(maintenance),
    validate: MAINTENANCE_VALIDATION,
  });

  // Refill from the latest record every time the drawer opens.
  useEffect(() => {
    if (!isOpen || !maintenance) return;

    const values = maintenanceToFormValues(maintenance);

    form.setValues(
      completing
        ? {
            ...values,
            status: ENUMS.MAINTENANCE.STATUSES.COMPLETED,
            endDate: values.endDate || new Date(),
          }
        : values,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, completing, maintenance?._id, maintenance?.updatedAt]);

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

    updateMaintenanceMutation.mutate(
      { maintenanceId: maintenance._id, payload },
      {
        onSuccess: () => {
          resetPhotos();
          onClose();
        },
      },
    );
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title={completing ? "Complete maintenance" : "Edit maintenance"}
      description={
        completing
          ? "Confirm the end date and add photos of the vehicle after service"
          : maintenance?.type?.title || "Update this service job's details"
      }
      submitLabel={completing ? "Mark completed" : "Save changes"}
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={updateMaintenanceMutation.isPending}
      error={updateMaintenanceMutation.error}
      aside={
        <>
          <MaintenancePhotoFields
            form={form}
            photos={photos}
            onPhotosChange={setPhotoField}
            job={maintenance}
          />
          <MaintenanceAsideFields form={form} />
        </>
      }
    >
      <MaintenanceMainFields form={form} />
    </FormShell>
  );
};

export default EditMaintenanceModal;
