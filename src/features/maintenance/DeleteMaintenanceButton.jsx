import { useDeleteMaintenanceMutation } from "../../api/maintenance";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeleteMaintenanceButton = ({
  maintenanceId,
  redirect = false,
  variant = "icon",
}) => (
  <DeleteItemButton
    label="maintenance job"
    mutationHook={useDeleteMaintenanceMutation}
    itemId={maintenanceId}
    variant={variant}
    buttonText="Delete"
    navigateTo={redirect ? "/maintenance" : undefined}
  />
);

export default DeleteMaintenanceButton;
