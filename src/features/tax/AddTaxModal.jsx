import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreateTaxMutation } from "../../api/tax";
import FormShell from "../../components/FormShell";
import { TaxAsideFields, TaxMainFields } from "./TaxFormFields";
import { TAX_INITIAL_VALUES, TAX_VALIDATION } from "./taxForm";

const AddTaxModal = ({ isOpen = false, onClose = () => {} }) => {
  const createTaxMutation = useCreateTaxMutation();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: TAX_INITIAL_VALUES,
    validate: TAX_VALIDATION,
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createTaxMutation.mutate(values, {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        navigate(`/tax/${data._id}`);
      },
    });
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Add tax"
      description="Record a tax filing for a vehicle"
      submitLabel="Add tax"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={createTaxMutation.isPending}
      error={createTaxMutation.error}
      aside={<TaxAsideFields form={form} />}
    >
      <TaxMainFields form={form} />
    </FormShell>
  );
};

export default AddTaxModal;
