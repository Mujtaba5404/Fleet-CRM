import AddButton from "../../../components/AddButton";
import CanAccess from "../../../components/CanAccess";
import RESOURCES from "../../../constants/RESOURCES";
import { usePicklists } from "../../../context/PicklistContext";

const AddPicklistModalButton = () => {
  const { featureName, openCreateModal } = usePicklists();

  return (
    <CanAccess resource={RESOURCES.PICKLIST} action="create">
      <AddButton
        title={`create ${featureName}`}
        subtitle={`add a new ${featureName}`}
        onClick={openCreateModal}
      />
    </CanAccess>
  );
};

export default AddPicklistModalButton;
