import { useDeleteTaxMutation } from "../../api/tax";
import DeleteItemButton from "../../components/DeleteItemButton";
import RESOURCES from "../../constants/RESOURCES";

const DeleteTaxButton = ({ taxId, redirect = false, variant = "icon" }) => (
  <DeleteItemButton
    resource={RESOURCES.TAXATION}
    label="challan"
    mutationHook={useDeleteTaxMutation}
    itemId={taxId}
    variant={variant}
    buttonText="Delete"
    navigateTo={redirect ? "/tax" : undefined}
  />
);

export default DeleteTaxButton;
