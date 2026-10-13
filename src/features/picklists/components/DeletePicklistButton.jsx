import { useDeletePicklistMutation } from "../../../api/picklist";
import DeleteItemButton from "../../../components/DeleteItemButton";
import RESOURCES from "../../../constants/RESOURCES";
import { usePicklists } from "../../../context/PicklistContext";

const DeletePicklistButton = ({ picklistId }) => {
  const { featureName } = usePicklists();

  return (
    <DeleteItemButton
      resource={RESOURCES.PICKLIST}
      label={featureName}
      mutationHook={useDeletePicklistMutation}
      itemId={picklistId}
    />
  );
};

export default DeletePicklistButton;
