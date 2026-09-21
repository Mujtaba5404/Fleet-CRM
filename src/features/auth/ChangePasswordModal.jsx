import { Button, Modal, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useChangePasswordMutation } from "../../api/auth";

const ChangePasswordModal = ({ isOpen = false, onClose = () => {} }) => {
  const changePasswordMutation = useChangePasswordMutation();

  const form = useForm({
    initialValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
    validate: {
      confirmNewPassword: (value, values) => (value !== values.newPassword ? `password does not match` : null),
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (values) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        onClose();
        form.reset();
      },
    });
  };

  return (
    <Modal title={"change password"} tt={"capitalize"} opened={isOpen} onClose={onClose}>
      <Stack component={"form"} onSubmit={form.onSubmit(handleSubmit)}>
        <PasswordInput required label="old password" data-autofocus {...form.getInputProps("oldPassword")} />
        <PasswordInput required label="new password" {...form.getInputProps("newPassword")} />
        <PasswordInput required label="confirm new password" {...form.getInputProps("confirmNewPassword")} />

        <Button fullWidth type="submit" mt={"md"} loading={changePasswordMutation.isPending}>
          Change password
        </Button>
      </Stack>
    </Modal>
  );
};

export default ChangePasswordModal;
