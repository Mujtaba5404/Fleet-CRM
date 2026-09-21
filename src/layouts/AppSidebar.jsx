import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  Iconfleet,
  IconChevronLeft,
  IconChevronRight,
  IconHexagonLetterA,
  IconListDetails,
  IconMoonStars,
  IconSunHigh,
} from "@tabler/icons-react";
import CanAccess from "../components/CanAccess";
import AppSidebarLink from "./AppSidebarLink";

const links = [
  { title: "fleets", path: "/dashboard", icon: Iconfleet },
  { title: "Picklists", path: "/clients", icon: IconListDetails },
];

const Guard = ({ resource, children }) =>
  resource ? (
    <CanAccess resource={resource} action="read">
      {children}
    </CanAccess>
  ) : (
    children
  );

const AppSidebar = ({ sidebarCollapsed: collapsed = false, onToggle }) => {
  const [auth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });
  const { toggleColorScheme } = useMantineColorScheme();
  const dark =
    useComputedColorScheme("light", { getInitialValueInEffect: true }) ===
    "dark";

  return (
    <Stack h="100%" gap={0} pos="relative">
      {onToggle && (
        <ActionIcon
          pos="absolute"
          top={18}
          right={-12}
          size={24}
          radius="xl"
          variant="default"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          style={{ zIndex: 1 }}
        >
          {collapsed ? (
            <IconChevronRight size={14} />
          ) : (
            <IconChevronLeft size={14} />
          )}
        </ActionIcon>
      )}

      <Group
        h={60}
        px="md"
        gap="sm"
        wrap="nowrap"
        justify={collapsed ? "center" : "flex-start"}
      >
        <ThemeIcon size={34} radius="md">
          <IconHexagonLetterA size={22} />
        </ThemeIcon>
      </Group>

      <ScrollArea flex={1} px={collapsed ? 12 : "sm"} scrollbarSize={4}>
        <Stack gap={4} mt="xs" align={collapsed ? "center" : "stretch"}>
          {links.map((link) => (
            <Guard key={link.path} resource={link.resource}>
              <AppSidebarLink link={link} collapsed={collapsed} />
            </Guard>
          ))}
        </Stack>
      </ScrollArea>

      <Divider />
      <Flex
        p="sm"
        gap="sm"
        align="center"
        justify="center"
        direction={collapsed ? "column-reverse" : "row"}
      >
        <Avatar radius="xl" color="initials" name={auth?.name} />
        {!collapsed && (
          <Box flex={1} miw={0}>
            <Text fz="sm" fw={600} tt="capitalize" truncate>
              {auth?.name}
            </Text>
            <Text fz="xs" c="dimmed" tt="capitalize" truncate>
              {auth?.effectiveScope}
            </Text>
          </Box>
        )}
        <Tooltip
          label={dark ? "Light mode" : "Dark mode"}
          position={collapsed ? "right" : "top"}
          withArrow
        >
          <ActionIcon
            size="lg"
            radius={999}
            variant={dark ? "light" : "subtle"}
            color={dark ? "orange" : "gray"}
            onClick={toggleColorScheme}
            aria-label="Toggle color scheme"
          >
            {dark ? <IconSunHigh size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Stack>
  );
};

export default AppSidebar;
