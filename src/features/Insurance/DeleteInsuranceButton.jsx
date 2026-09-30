import { useDeleteInsuranceMutation } from "../../api/insurance";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeleteInsuranceButton = ({
  insuranceId,
  redirect = false,
  variant = "icon",
}) => (
  <DeleteItemButton
    label="policy"
    mutationHook={useDeleteInsuranceMutation}
    itemId={insuranceId}
    variant={variant}
    buttonText="Delete"
    navigateTo={redirect ? "/insurance" : undefined}
  />
);

export default DeleteInsuranceButton;
