import { useDeleteRoleMutation } from "../../api/role";
import RecordRowMenu from "../../components/RecordRowMenu";
import EditRoleModal from "./EditRoleModal";

const RoleTableRowMenu = ({ role }) => (
  <RecordRowMenu
    viewTo={`/admin-settings/roles/${role._id}`}
    label="role"
    itemId={role._id}
    deleteMutationHook={useDeleteRoleMutation}
    renderEditModal={({ opened, onClose }) => (
      <EditRoleModal role={role} isOpen={opened} onClose={onClose} />
    )}
  />
);

export default RoleTableRowMenu;
