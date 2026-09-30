import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdateTaxMutation } from "../../api/tax";
import FormShell from "../../components/FormShell";
import { TaxAsideFields, TaxMainFields } from "./TaxFormFields";
import { TAX_VALIDATION, taxToFormValues } from "./taxForm";

const EditTaxModal = ({ tax, isOpen = false, onClose = () => {} }) => {
  const updateTaxMutation = useUpdateTaxMutation();

  const form = useForm({
    initialValues: taxToFormValues(tax),
    validate: TAX_VALIDATION,
  });

  // Refill from the latest record every time the drawer opens.
  useEffect(() => {
    if (isOpen && tax) form.setValues(taxToFormValues(tax));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tax?._id, tax?.updatedAt]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    updateTaxMutation.mutate(
      { taxationId: tax._id, payload: values },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Edit challan"
      description={tax?.challanNumber || "Update this tax record"}
      submitLabel="Save changes"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={updateTaxMutation.isPending}
      error={updateTaxMutation.error}
      aside={<TaxAsideFields form={form} />}
    >
      <TaxMainFields form={form} />
    </FormShell>
  );
};

export default EditTaxModal;
