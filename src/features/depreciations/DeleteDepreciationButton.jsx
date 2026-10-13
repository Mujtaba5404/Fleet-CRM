import { useDeleteDepreciationMutation } from "../../api/depreciation";
import DeleteItemButton from "../../components/DeleteItemButton";
import RESOURCES from "../../constants/RESOURCES";

const DeleteDepreciationButton = ({
  depreciationId,
  redirect = false,
  variant = "icon",
}) => (
  <DeleteItemButton
    resource={RESOURCES.DEPRECIATION}
    label="depreciation"
    mutationHook={useDeleteDepreciationMutation}
    itemId={depreciationId}
    variant={variant}
    buttonText="Delete"
    navigateTo={redirect ? "/depreciations" : undefined}
  />
);

export default DeleteDepreciationButton;
