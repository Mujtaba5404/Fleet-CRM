import { Center, Stack, Text, Title } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Navigate } from "react-router-dom";
import { usePermissions, usePermissionsLoaded } from "../hooks/useCanAccess";
import { ALL_NAV_LINKS, findNavLink, HOME_PATH } from "../layouts/navigation";

/**
 * "/" lands on the role's landing page when it can open it, then the summary,
 * then the first screen it can read. A user who can read nothing is told why
 * instead of being sent round in a loop.
 */
const HomeRedirect = () => {
  const [auth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });
  const can = usePermissions();
  const loaded = usePermissionsLoaded();

  const links = ALL_NAV_LINKS.filter((link) => can(link.resource, "read"));
  const landing = auth?.indexPath && findNavLink(auth.indexPath);
  const home =
    (landing && links.includes(landing) && auth.indexPath) ||
    links.find((link) => link.path === HOME_PATH)?.path ||
    links[0]?.path;

  if (home) return <Navigate to={home} replace />;

  // Still finding out what this user may open.
  if (!loaded) return null;

  return (
    <Center h="60vh">
      <Stack gap={4} align="center" maw={420}>
        <Title order={3}>No access yet</Title>
        <Text c="dimmed" fz="sm" ta="center">
          {auth?.accessError ||
            "Your role does not grant any Fleet screens. Ask an admin to add permissions to it."}
        </Text>
      </Stack>
    </Center>
  );
};

export default HomeRedirect;
