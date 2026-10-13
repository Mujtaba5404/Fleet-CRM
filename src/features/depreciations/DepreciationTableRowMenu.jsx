import { useDeleteDepreciationMutation } from "../../api/depreciation";
import RecordRowMenu from "../../components/RecordRowMenu";
import RESOURCES from "../../constants/RESOURCES";
import EditDepreciationModal from "./EditDepreciationModal";

const DepreciationTableRowMenu = ({ depreciation }) => (
  <RecordRowMenu
    resource={RESOURCES.DEPRECIATION}
    viewTo={`/depreciations/${depreciation._id}`}
    label="depreciation"
    itemId={depreciation._id}
    deleteMutationHook={useDeleteDepreciationMutation}
    renderEditModal={({ opened, onClose }) => (
      <EditDepreciationModal
        depreciation={depreciation}
        isOpen={opened}
        onClose={onClose}
      />
    )}
  />
);

export default DepreciationTableRowMenu;
