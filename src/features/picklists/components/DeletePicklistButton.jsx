import { useDeletePicklistMutation } from "../../../api/picklist";
import DeleteItemButton from "../../../components/DeleteItemButton";
import PICKLIST_SCOPE from "../../../constants/PICKLIST_SCOPE";
import { usePicklists } from "../../../context/PicklistContext";

const DeletePicklistButton = ({ picklistId }) => {
  const { scope, resource, featureName } = usePicklists();

  return (
    <DeleteItemButton
      resource={scope === PICKLIST_SCOPE.RESOURCE ? resource : "picklist"}
      label={featureName}
      mutationHook={useDeletePicklistMutation}
      itemId={picklistId}
    />
  );
};

export default DeletePicklistButton;
