import { useDeletefleetMutation } from "../../api/fleet";
import RecordRowMenu from "../../components/RecordRowMenu";
import RESOURCES from "../../constants/RESOURCES";
import EditfleetModal from "./EditfleetModal";

const FleetTableRowMenu = ({ fleet }) => (
  <RecordRowMenu
    resource={RESOURCES.FLEET}
    viewTo={`/fleets/${fleet._id}`}
    label="vehicle"
    itemId={fleet._id}
    deleteMutationHook={useDeletefleetMutation}
    renderEditModal={({ opened, onClose }) => (
      <EditfleetModal fleet={fleet} isOpen={opened} onClose={onClose} />
    )}
  />
);

export default FleetTableRowMenu;
