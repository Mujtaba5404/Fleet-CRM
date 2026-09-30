import { useDeletefleetMutation } from "../../api/fleet";
import RecordRowMenu from "../../components/RecordRowMenu";
import EditfleetModal from "./EditfleetModal";

const FleetTableRowMenu = ({ fleet }) => (
  <RecordRowMenu
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
