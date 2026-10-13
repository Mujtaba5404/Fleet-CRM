import { useDeleteMaintenanceMutation } from "../../api/maintenance";
import DeleteItemButton from "../../components/DeleteItemButton";
import RESOURCES from "../../constants/RESOURCES";

const DeleteMaintenanceButton = ({
  maintenanceId,
  redirect = false,
  variant = "icon",
}) => (
  <DeleteItemButton
    resource={RESOURCES.MAINTENANCE}
    label="maintenance job"
    mutationHook={useDeleteMaintenanceMutation}
    itemId={maintenanceId}
    variant={variant}
    buttonText="Delete"
    navigateTo={redirect ? "/maintenance" : undefined}
  />
);

export default DeleteMaintenanceButton;
