import { useDeleteRoleMutation } from "../../api/role";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeleteRoleButton = ({ roleId, redirect = false, variant = "icon" }) => (
  <DeleteItemButton
    label="role"
    mutationHook={useDeleteRoleMutation}
    itemId={roleId}
    variant={variant}
    buttonText="Delete"
    confirmText="Are you sure you want to delete this role? Users who hold it will lose its permissions. This cannot be undone."
    navigateTo={redirect ? "/admin-settings/roles" : undefined}
  />
);

export default DeleteRoleButton;
