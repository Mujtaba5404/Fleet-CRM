import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreateInsuranceMutation } from "../../api/insurance";
import FormShell from "../../components/FormShell";
import {
  InsuranceAsideFields,
  InsuranceMainFields,
} from "./InsuranceFormFields";
import {
  INSURANCE_INITIAL_VALUES,
  INSURANCE_VALIDATION,
  insuranceToPayload,
} from "./insuranceForm";

const AddInsuranceModal = ({ isOpen = false, onClose = () => {} }) => {
  const createInsuranceMutation = useCreateInsuranceMutation();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: INSURANCE_INITIAL_VALUES,
    validate: INSURANCE_VALIDATION,
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createInsuranceMutation.mutate(insuranceToPayload(values), {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        navigate(`/insurance/${data._id}`);
      },
    });
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Add policy"
      description="Record a new insurance policy for a vehicle"
      submitLabel="Add policy"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={createInsuranceMutation.isPending}
      error={createInsuranceMutation.error}
      aside={<InsuranceAsideFields form={form} />}
    >
      <InsuranceMainFields form={form} />
    </FormShell>
  );
};

export default AddInsuranceModal;
