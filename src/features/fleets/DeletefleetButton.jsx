import { useDeletefleetMutation } from "../../api/fleet";
import DeleteItemButton from "../../components/DeleteItemButton";
import RESOURCES from "../../constants/RESOURCES";

const DeletefleetButton = ({ fleetId, redirect = false, variant = "icon" }) => (
  <DeleteItemButton
    resource={RESOURCES.FLEET}
    label="vehicle"
    mutationHook={useDeletefleetMutation}
    itemId={fleetId}
    variant={variant}
    buttonText="Delete"
    navigateTo={redirect ? "/fleets" : undefined}
  />
);

export default DeletefleetButton;
