import { useDeleteInsuranceMutation } from "../../api/insurance";
import DeleteItemButton from "../../components/DeleteItemButton";
import RESOURCES from "../../constants/RESOURCES";

const DeleteInsuranceButton = ({
  insuranceId,
  redirect = false,
  variant = "icon",
}) => (
  <DeleteItemButton
    resource={RESOURCES.INSURANCE}
    label="policy"
    mutationHook={useDeleteInsuranceMutation}
    itemId={insuranceId}
    variant={variant}
    buttonText="Delete"
    navigateTo={redirect ? "/insurance" : undefined}
  />
);

export default DeleteInsuranceButton;
