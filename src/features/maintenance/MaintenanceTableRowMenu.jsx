import { useDeleteMaintenanceMutation } from "../../api/maintenance";
import RecordRowMenu from "../../components/RecordRowMenu";
import EditMaintenanceModal from "./EditMaintenanceModal";

const MaintenanceTableRowMenu = ({ maintenance }) => (
  <RecordRowMenu
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
