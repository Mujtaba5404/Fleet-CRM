import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  IconLock,
  IconLogout,
  IconMoonStars,
  IconSunHigh,
  IconUserCircle,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../api/auth";
import ChangePasswordModal from "../features/auth/ChangePasswordModal";

const UserMenu = () => {
  const [auth, , removeAuth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });
  const [, , removeGlobalFilters] = useLocalStorage({
    key: "globalFilters",
    getInitialValueInEffect: false,
  });
  const navigate = useNavigate();

  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [
    changePasswordModalOpened,
    { open: openChangePasswordModal, close: closeChangePasswordModal },
  ] = useDisclosure(false);

  const logoutMutation = useLogoutMutation();
  const queryClient = useQueryClient();

  // Auth360 clears the session cookies; the stored profile is dropped either
  // way, so a failed call can never strand someone in a signed-in shell.
  const handleLogOut = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        removeAuth();
        removeGlobalFilters();
        queryClient.clear();

        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <>
      <ChangePasswordModal
        isOpen={changePasswordModalOpened}
        onClose={closeChangePasswordModal}
      />

      <Menu width={230} position="bottom-end" shadow="md">
        <Menu.Target>
          <ActionIcon size="lg" aria-label="Account menu">
            <IconUserCircle size={24} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          {/* Nothing else in the chrome says who is signed in. */}
          <Group gap="sm" wrap="nowrap" px="sm" py={8}>
            <Avatar radius="xl" size={32} color="initials" name={auth?.name} />

            <Stack gap={0} miw={0}>
              <Text fz="sm" fw={600} tt="capitalize" truncate>
                {auth?.name || "Signed in"}
              </Text>

              <Text fz="xs" c="dimmed" truncate>
                {auth?.email || auth?.effectiveScope || "—"}
              </Text>
            </Stack>
          </Group>

          <Menu.Divider />

          <Menu.Item
            leftSection={
              colorScheme === "dark" ? (
                <IconSunHigh color={theme.colors.yellow[4]} size={18} />
              ) : (
                <IconMoonStars color={theme.colors.blue[7]} size={18} />
              )
            }
            onClick={toggleColorScheme}
          >
            Toggle color scheme
          </Menu.Item>

          <Menu.Item
            onClick={openChangePasswordModal}
            leftSection={<IconLock size={18} />}
          >
            Change password
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<IconLogout size={18} />}
            onClick={handleLogOut}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default UserMenu;
