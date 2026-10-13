import { useDeleteMaintenanceMutation } from "../../api/maintenance";
import RecordRowMenu from "../../components/RecordRowMenu";
import RESOURCES from "../../constants/RESOURCES";
import EditMaintenanceModal from "./EditMaintenanceModal";

const MaintenanceTableRowMenu = ({ maintenance }) => (
  <RecordRowMenu
    resource={RESOURCES.MAINTENANCE}
    viewTo={`/maintenance/${maintenance._id}`}
    label="maintenance job"
    itemId={maintenance._id}
    deleteMutationHook={useDeleteMaintenanceMutation}
    renderEditModal={({ opened, onClose }) => (
      <EditMaintenanceModal
        maintenance={maintenance}
        isOpen={opened}
        onClose={onClose}
      />
    )}
  />
);

export default MaintenanceTableRowMenu;
