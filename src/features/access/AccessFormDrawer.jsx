import { Avatar, Group, Loader, Select, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconShieldLock, IconUser } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import {
  idOf,
  useCreateAccessMutation,
  useGetAccessUsersQuery,
  useGetAllAccessQuery,
  useUpdateAccessMutation,
} from "../../api/access";
import { useGetAllRolesQuery } from "../../api/role";
import FormSection from "../../components/FormSection";
import FormShell from "../../components/FormShell";
import capitalizeLetters from "../../utils/capitalizeLetters";
import { getScopeOption } from "../roles/roleForm";
import RolePreview from "./RolePreview";

const FORM_SIZE = "40rem";

const validate = {
  user: (value) => (value ? null : "Pick a user"),
  role: (value) => (value ? null : "Pick a role"),
};

/**
 * Gives a user a role (new Access record), or changes the role on `access`.
 * The role decides what that user sees and can do across the CRM.
 */
const AccessFormDrawer = ({ access, isOpen = false, onClose = () => {} }) => {
  const isEdit = Boolean(access?._id);

  const users = useGetAccessUsersQuery();
  const roles = useGetAllRolesQuery();
  const allAccess = useGetAllAccessQuery();

  const createMutation = useCreateAccessMutation();
  const updateMutation = useUpdateAccessMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm({
    initialValues: { user: null, role: null },
    validate,
  });

  useEffect(() => {
    if (!isOpen) return;

    const values = {
      user: isEdit ? idOf(access.user) : null,
      role: isEdit ? (idOf(access.roles?.[0]) ?? null) : null,
    };

    form.setInitialValues(values);
    form.setValues(values);
    form.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, access?._id, access?.updatedAt]);

  // One Access record per user: anyone who already has one is edited, not added again.
  const userOptions = useMemo(() => {
    const taken = new Set(
      (allAccess.data ?? []).map((record) => idOf(record.user)),
    );

    return (users.data ?? [])
      .filter((user) => isEdit || !taken.has(user._id))
      .map((user) => ({
        value: user._id,
        label: capitalizeLetters(user.name || user.email),
        email: user.email,
        name: user.name,
        disabled: user.isActive === false,
      }));
  }, [users.data, allAccess.data, isEdit]);

  const roleList = Array.isArray(roles.data)
    ? roles.data
    : (roles.data?.data ?? []);

  const roleOptions = roleList.map((role) => ({
    value: role._id,
    label: capitalizeLetters(role.title),
    scope: getScopeOption(role.scope)?.label,
  }));

  const pickedRole = roleList.find((role) => role._id === form.values.role);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = ({ user, role }) => {
    mutation.mutate(
      isEdit
        ? { accessId: access._id, payload: { roles: role } }
        : { user, roles: role },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      },
    );
  };

  const userName = userOptions.find(
    (option) => option.value === form.values.user,
  )?.label;

  return (
    <FormShell
      opened={isOpen}
      onClose={handleClose}
      size={FORM_SIZE}
      title={isEdit ? "Change access" : "Give access"}
      description={
        isEdit
          ? userName || "Change this user's role"
          : "Pick a user and the role that decides what they can see"
      }
      submitLabel={isEdit ? "Save changes" : "Give access"}
      isSubmitting={mutation.isPending}
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <FormSection
        icon={IconUser}
        title="User"
        description="Who is being given access to Fleet"
        plain
      >
        <Select
          required
          searchable
          label="User"
          placeholder={
            users.isLoading ? "Loading users…" : "Search by name or email"
          }
          nothingFoundMessage={
            users.data?.length
              ? "Everyone already has access"
              : "No users found"
          }
          data={userOptions}
          disabled={isEdit || users.isError}
          description={
            isEdit
              ? "To give access to someone else, add a new record."
              : undefined
          }
          rightSection={users.isLoading ? <Loader size={16} /> : undefined}
          filter={({ options, search }) => {
            const term = search.trim().toLowerCase();

            return options.filter(
              (option) =>
                !term ||
                option.label.toLowerCase().includes(term) ||
                option.email?.toLowerCase().includes(term),
            );
          }}
          renderOption={({ option }) => (
            <Group gap="sm" wrap="nowrap">
              <Avatar
                size={28}
                radius="xl"
                color="initials"
                name={option.name || option.email}
              />

              <Stack gap={0} miw={0}>
                <Text fz="sm" truncate>
                  {option.label}
                </Text>
                <Text fz="xs" c="dimmed" truncate>
                  {option.email}
                </Text>
              </Stack>
            </Group>
          )}
          {...form.getInputProps("user")}
        />
      </FormSection>

      <FormSection
        icon={IconShieldLock}
        title="Role"
        description="Decides which screens they see and what they can change"
        plain
      >
        <Stack gap="sm">
          <Select
            required
            searchable
            label="Role"
            placeholder={roles.isLoading ? "Loading roles…" : "Select role"}
            data={roleOptions}
            disabled={roles.isError}
            rightSection={roles.isLoading ? <Loader size={16} /> : undefined}
            renderOption={({ option }) => (
              <Group gap="xs" justify="space-between" wrap="nowrap" w="100%">
                <Text fz="sm">{option.label}</Text>
                {option.scope && (
                  <Text fz="xs" c="dimmed">
                    {option.scope} scope
                  </Text>
                )}
              </Group>
            )}
            {...form.getInputProps("role")}
          />

          {pickedRole && <RolePreview role={pickedRole} />}
        </Stack>
      </FormSection>
    </FormShell>
  );
};

export default AccessFormDrawer;
