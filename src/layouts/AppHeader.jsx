import { Box, Burger, Group, Text } from "@mantine/core";
import { useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import UserMenu from "../components/UserMenu";
import { findNavLink } from "./navigation";

/**
 * The colour scheme toggle is deliberately not here — it lives in the sidebar
 * footer and in the user menu, so the header stays down to navigation and
 * account.
 */
const AppHeader = ({ mobileOpened, onMobileToggle }) => {
  const { pathname } = useLocation();

  const current = findNavLink(pathname);

  return (
    <Group h="100%" px="md" gap="sm" wrap="nowrap" justify="space-between">
      <Group gap="sm" wrap="nowrap" miw={0}>
        <Burger
          opened={mobileOpened}
          onClick={onMobileToggle}
          hiddenFrom="md"
          size="sm"
          aria-label="Toggle navigation"
        />

        {/* On mobile the sidebar is hidden, so the header carries the brand. */}
        <Box hiddenFrom="md">
          <Logo w={120} alt="FleetCRM" />
        </Box>

        {/* On desktop the brand lives in the sidebar, so show the section instead. */}
        <Text fz="sm" fw={600} visibleFrom="md" truncate>
          {current?.title ?? "FleetCRM"}
        </Text>
      </Group>

      <Group gap="xs" wrap="nowrap">
        <UserMenu />
      </Group>
    </Group>
  );
};

export default AppHeader;
