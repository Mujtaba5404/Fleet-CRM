import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdateRoleMutation } from "../../api/role";
import FormShell from "../../components/FormShell";
import {
  formValuesToPayload,
  ROLE_VALIDATION,
  roleToFormValues,
} from "./roleForm";
import { RoleAsideFields, RoleMainFields } from "./RoleFormFields";
import usePermissionCatalog from "./usePermissionCatalog";

const EditRoleModal = ({ role, isOpen = false, onClose = () => {} }) => {
  const updateRoleMutation = useUpdateRoleMutation();
  const catalog = usePermissionCatalog(role);

  const form = useForm({
    initialValues: roleToFormValues(role),
    validate: ROLE_VALIDATION,
  });

  // Refill from the latest record every time the modal opens.
  useEffect(() => {
    if (isOpen && role) form.setValues(roleToFormValues(role));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, role?._id, role?.updatedAt]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    updateRoleMutation.mutate(
      { roleId: role._id, payload: formValuesToPayload(values) },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      title="Edit role"
      description={role?.title || "Update this role's permissions"}
      submitLabel="Save changes"
      onSubmit={form.onSubmit(handleSubmit)}
      isSubmitting={updateRoleMutation.isPending}
      error={updateRoleMutation.error}
      aside={<RoleAsideFields form={form} catalog={catalog} />}
    >
      <RoleMainFields form={form} />
    </FormShell>
  );
};

export default EditRoleModal;
