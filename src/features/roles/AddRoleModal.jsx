import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreateRoleMutation } from "../../api/role";
import FormShell from "../../components/FormShell";
import {
  formValuesToPayload,
  ROLE_INITIAL_VALUES,
  ROLE_VALIDATION,
} from "./roleForm";
import { RoleAsideFields, RoleMainFields } from "./RoleFormFields";
import usePermissionCatalog from "./usePermissionCatalog";

const AddRoleModal = ({ isOpen = false, onClose = () => {} }) => {
  const createRoleMutation = useCreateRoleMutation();
  const navigate = useNavigate();
  const catalog = usePermissionCatalog();

  const form = useForm({
    initialValues: ROLE_INITIAL_VALUES,
    validate: ROLE_VALIDATION,
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createRoleMutation.mutate(formValuesToPayload(values), {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        navigate(`/admin-settings/roles/${data._id}`);
      },
    });
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Add role"
      description="Bundle a set of permissions you can assign to users"
      submitLabel="Create role"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={createRoleMutation.isPending}
      error={createRoleMutation.error}
      aside={<RoleAsideFields form={form} catalog={catalog} />}
    >
      <RoleMainFields form={form} />
    </FormShell>
  );
};

export default AddRoleModal;
