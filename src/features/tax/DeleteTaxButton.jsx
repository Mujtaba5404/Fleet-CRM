import { useDeleteTaxMutation } from "../../api/tax";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeleteTaxButton = ({ taxId, redirect = false, variant = "icon" }) => (
  <DeleteItemButton
    label="challan"
    mutationHook={useDeleteTaxMutation}
    itemId={taxId}
    variant={variant}
    buttonText="Delete"
    navigateTo={redirect ? "/tax" : undefined}
  />
);

export default DeleteTaxButton;
