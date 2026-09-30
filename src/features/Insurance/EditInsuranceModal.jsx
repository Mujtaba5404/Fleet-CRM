import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdateInsuranceMutation } from "../../api/insurance";
import FormShell from "../../components/FormShell";
import {
  InsuranceAsideFields,
  InsuranceMainFields,
} from "./InsuranceFormFields";
import { INSURANCE_VALIDATION, insuranceToFormValues } from "./insuranceForm";

const EditInsuranceModal = ({
  insurance,
  isOpen = false,
  onClose = () => {},
}) => {
  const updateInsuranceMutation = useUpdateInsuranceMutation();

  const form = useForm({
    initialValues: insuranceToFormValues(insurance),
    validate: INSURANCE_VALIDATION,
  });

  // Refill from the latest record every time the drawer opens.
  useEffect(() => {
    if (isOpen && insurance) form.setValues(insuranceToFormValues(insurance));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, insurance?._id, insurance?.updatedAt]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    updateInsuranceMutation.mutate(
      { insuranceId: insurance._id, payload: values },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Edit policy"
      description={insurance?.policyNumber || "Update this policy's details"}
      submitLabel="Save changes"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={updateInsuranceMutation.isPending}
      error={updateInsuranceMutation.error}
      aside={<InsuranceAsideFields form={form} />}
    >
      <InsuranceMainFields form={form} />
    </FormShell>
  );
};

export default EditInsuranceModal;
