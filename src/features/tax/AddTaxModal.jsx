import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useGetAllfleetsQuery } from "../../api/fleet";
import { useCreateTaxMutation } from "../../api/tax";
import FormShell from "../../components/FormShell";
import { showNotification } from "../../notifications/showNotification";
import { TaxAsideFields, TaxMainFields } from "./TaxFormFields";
import { TAX_CREATE_VALIDATION, TAX_INITIAL_VALUES } from "./taxForm";

const idOf = (value) => value?._id ?? value ?? null;

const AddTaxModal = ({ isOpen = false, onClose = () => {} }) => {
  const createTaxMutation = useCreateTaxMutation();
  const navigate = useNavigate();

  // Same query (and cache) as the vehicle select in the form.
  const fleets = useGetAllfleetsQuery({ query: {} });

  const form = useForm({
    initialValues: TAX_INITIAL_VALUES,
    validate: TAX_CREATE_VALIDATION,
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Status is not asked for on create, so do not send an empty one. The
  // company is the vehicle's: the form has no company field.
  // eslint-disable-next-line no-unused-vars
  const handleSubmit = ({ status, company, ...values }) => {
    const fleet = fleets.data?.find((item) => item._id === values.fleet);
    const fleetCompany = idOf(fleet?.company) || company;

    createTaxMutation.mutate(
      { ...values, ...(fleetCompany && { company: fleetCompany }) },
      {
        onSuccess: ({ data }) => {
          form.reset();
          onClose();
          navigate(`/tax/${data._id}`);
        },
      },
    );
  };

  // A failed check on a field you cannot see must not look like a dead button.
  const handleInvalid = (errors) =>
    showNotification({
      title: "Please check the form",
      message: Object.values(errors).filter(Boolean).join(" · "),
      type: "error",
    });

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Add tax"
      description="Record a tax filing for a vehicle"
      submitLabel="Add tax"
      onSubmit={form.onSubmit(handleSubmit, handleInvalid)}
      isSubmitting={createTaxMutation.isPending}
      error={createTaxMutation.error}
      aside={<TaxAsideFields form={form} />}
    >
      <TaxMainFields form={form} withStatus={false} />
    </FormShell>
  );
};

export default AddTaxModal;
