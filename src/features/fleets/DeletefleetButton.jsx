import { useDeletefleetMutation } from "../../api/fleet";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeletefleetButton = ({ fleetId, redirect = false, variant = "icon" }) => (
  <DeleteItemButton
    label="vehicle"
    mutationHook={useDeletefleetMutation}
    itemId={fleetId}
    variant={variant}
    buttonText="Delete"
    navigateTo={redirect ? "/fleets" : undefined}
  />
);

export default DeletefleetButton;
