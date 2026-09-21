import { useDeletefleetMutation } from "../../api/fleet";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeletefleetButton = ({ fleetId, redirect = false }) => {
  return (
    <DeleteItemButton
      label="fleet"
      mutationHook={useDeletefleetMutation}
      itemId={fleetId}
      navigateTo={redirect ? "/fleets" : undefined}
    />
  );
};

export default DeletefleetButton;
