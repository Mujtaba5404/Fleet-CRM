import {
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useChangePasswordMutation } from "../../api/auth";

const MIN_LENGTH = 8;

const ChangePasswordModal = ({ isOpen = false, onClose = () => {} }) => {
  const changePasswordMutation = useChangePasswordMutation();

  const form = useForm({
    initialValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
    validate: {
      oldPassword: (value) => (value ? null : "Enter your current password"),
      newPassword: (value, values) => {
        if (!value) return "Enter a new password";
        if (value.length < MIN_LENGTH)
          return `Use at least ${MIN_LENGTH} characters`;

        return value === values.oldPassword
          ? "The new password must be different"
          : null;
      },
      confirmNewPassword: (value, values) =>
        value !== values.newPassword ? "Passwords do not match" : null,
    },
    validateInputOnChange: true,
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Stack gap={0}>
          <Text fz="md" fw={650}>
            Change password
          </Text>

          <Text fz="xs" c="dimmed">
            You will stay signed in on this device
          </Text>
        </Stack>
      }
    >
      <Stack component="form" gap="md" onSubmit={form.onSubmit(handleSubmit)}>
        <PasswordInput
          withAsterisk
          label="Current password"
          data-autofocus
          autoComplete="current-password"
          {...form.getInputProps("oldPassword")}
        />

        <PasswordInput
          withAsterisk
          label="New password"
          description={`At least ${MIN_LENGTH} characters`}
          autoComplete="new-password"
          {...form.getInputProps("newPassword")}
        />

        <PasswordInput
          withAsterisk
          label="Confirm new password"
          autoComplete="new-password"
          {...form.getInputProps("confirmNewPassword")}
        />

        <Group justify="flex-end" gap="sm" mt="xs">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>

          <Button type="submit" loading={changePasswordMutation.isPending}>
            Change password
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ChangePasswordModal;
