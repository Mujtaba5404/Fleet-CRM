import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreatefleetMutation } from "../../api/fleet";
import FormShell from "../../components/FormShell";
import { FleetAsideFields, FleetMainFields } from "./FleetFormFields";
import { FLEET_INITIAL_VALUES, FLEET_VALIDATION } from "./fleetForm";

const AddfleetModal = ({ isOpen = false, onClose = () => {} }) => {
  const createfleetMutation = useCreatefleetMutation();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: FLEET_INITIAL_VALUES,
    validate: FLEET_VALIDATION,
  });

  form.watch("make", ({ value, previousValue }) => {
    if (value !== previousValue) form.setFieldValue("model", null);
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createfleetMutation.mutate(values, {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        navigate(`/fleets/${data._id}`);
      },
    });
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Add vehicle"
      description="Register a new vehicle in your fleet"
      submitLabel="Add vehicle"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={createfleetMutation.isPending}
      error={createfleetMutation.error}
      aside={<FleetAsideFields form={form} />}
    >
      <FleetMainFields form={form} />
    </FormShell>
  );
};

export default AddfleetModal;
