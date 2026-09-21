import { Group, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import SCOPE from "../constants/SCOPE";
import UserMenu from "../components/UserMenu";
import Logo from "../components/Logo";

const AppHeader = () => {
  const [auth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });
  const CAN_SELECT_COMPANY = [SCOPE.ALL, SCOPE.COMPANY].includes(auth?.effectiveScope);

  return (
    <Group h="100%" justify="space-between">
  <Logo w={200} />

  <Group gap="sm">
    <Text tt="capitalize" visibleFrom="sm">👋 Hi, {auth?.name}!</Text>
    <UserMenu />
  </Group>
</Group>
  );
};

export default AppHeader;