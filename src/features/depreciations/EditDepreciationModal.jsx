import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdateDepreciationMutation } from "../../api/depreciation";
import FormShell from "../../components/FormShell";
import { showNotification } from "../../notifications/showNotification";
import {
  DEPRECIATION_VALIDATION,
  depreciationToFormValues,
  formValuesToPayload,
} from "./depreciationForm";
import {
  DepreciationAsideFields,
  DepreciationMainFields,
} from "./DepreciationFormFields";

const EditDepreciationModal = ({
  depreciation,
  isOpen = false,
  onClose = () => {},
}) => {
  const updateDepreciationMutation = useUpdateDepreciationMutation();

  const form = useForm({
    initialValues: depreciationToFormValues(depreciation),
    validate: DEPRECIATION_VALIDATION,
  });

  // Refill from the latest record every time the form opens.
  useEffect(() => {
    if (isOpen && depreciation)
      form.setValues(depreciationToFormValues(depreciation));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, depreciation?._id, depreciation?.updatedAt]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    updateDepreciationMutation.mutate(
      {
        depreciationId: depreciation._id,
        payload: formValuesToPayload(values),
      },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Edit depreciation"
      description={
        depreciation?.fleet?.licensePlate || "Update this depreciation"
      }
      submitLabel="Save changes"
      onSubmit={form.onSubmit(handleSubmit, (errors) =>
        showNotification({
          title: "Please check the form",
          message: Object.values(errors).filter(Boolean).join(" · "),
          type: "error",
        }),
      )}
      isSubmitting={updateDepreciationMutation.isPending}
      error={updateDepreciationMutation.error}
      aside={<DepreciationAsideFields form={form} />}
    >
      <DepreciationMainFields form={form} />
    </FormShell>
  );
};

export default EditDepreciationModal;
