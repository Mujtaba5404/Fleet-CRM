import { useDeletefleetMutation } from "../../api/fleet";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeleteMaintenanceButton = ({ maintenanceId, redirect = false }) => {
  return (
    <DeleteItemButton
      label="maintenance"
      mutationHook={useDeletefleetMutation}
      itemId={maintenanceId}
      navigateTo={redirect ? "/maintenance" : undefined}
    />
  );
};

export default DeleteMaintenanceButton;
