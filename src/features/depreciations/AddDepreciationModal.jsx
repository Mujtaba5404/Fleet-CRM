import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreateDepreciationMutation } from "../../api/depreciation";
import { useGetAllfleetsQuery } from "../../api/fleet";
import FormShell from "../../components/FormShell";
import { showNotification } from "../../notifications/showNotification";
import {
  DEPRECIATION_INITIAL_VALUES,
  DEPRECIATION_VALIDATION,
  formValuesToPayload,
  toDateString,
} from "./depreciationForm";
import {
  DepreciationAsideFields,
  DepreciationMainFields,
} from "./DepreciationFormFields";
/** What a vehicle already tells us: its cost and when it was bought. */
const fromVehicle = (fleet) => ({
  fleet: fleet._id,
  ...(fleet.purchaseAmount && { acquisitionCost: fleet.purchaseAmount }),
  ...(fleet.purchaseDate && { startDate: toDateString(fleet.purchaseDate) }),
});

/**
 * Pass `fleet` to add a schedule for that vehicle from its own screen: the
 * vehicle is fixed and you stay on that screen afterwards.
 */
const AddDepreciationModal = ({ isOpen = false, onClose = () => {}, fleet }) => {
  const createDepreciationMutation = useCreateDepreciationMutation();
  const navigate = useNavigate();

  const fleets = useGetAllfleetsQuery({ query: {} });

  const form = useForm({
    initialValues: {
      ...DEPRECIATION_INITIAL_VALUES,
      ...(fleet && fromVehicle(fleet)),
    },
    validate: DEPRECIATION_VALIDATION,
  });

  const handleFleetChange = (fleetId) => {
    const fleet = fleets.data?.find((item) => item._id === fleetId);
    if (!fleet) return;

    if (form.values.acquisitionCost === "" && fleet.purchaseAmount)
      form.setFieldValue("acquisitionCost", fleet.purchaseAmount);

    if (!form.values.startDate && fleet.purchaseDate)
      form.setFieldValue("startDate", toDateString(fleet.purchaseDate));
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createDepreciationMutation.mutate(formValuesToPayload(values), {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        if (!fleet) navigate(`/depreciations/${data._id}`);
      },
    });
  };

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
      title="Add depreciation"
      description="Track how a vehicle's value falls over its useful life"
      submitLabel="Add depreciation"
      onSubmit={form.onSubmit(handleSubmit, handleInvalid)}
      isSubmitting={createDepreciationMutation.isPending}
      error={createDepreciationMutation.error}
      aside={<DepreciationAsideFields form={form} />}
    >
      <DepreciationMainFields
        form={form}
        onFleetChange={handleFleetChange}
        fleetLocked={!!fleet}
      />
    </FormShell>
  );
};

export default AddDepreciationModal;
