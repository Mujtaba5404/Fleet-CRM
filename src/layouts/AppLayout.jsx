import { AppShell, Drawer } from "@mantine/core";
import { useDisclosure, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const EXPANDED_WIDTH = 260;
const RAIL_WIDTH = 76;

/** Matches the AppShell `md` breakpoint below. */
const DESKTOP_QUERY = "(min-width: 62em)";

const AppLayout = () => {
  const { pathname } = useLocation();
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure(false);

  const isDesktop = useMediaQuery(DESKTOP_QUERY, true, {
    getInitialValueInEffect: false,
  });

  // Remembered across sessions so power users keep their icon rail.
  const [collapsed, setCollapsed] = useLocalStorage({
    key: "sidebarCollapsed",
    defaultValue: false,
    getInitialValueInEffect: false,
  });

  // A tap in the mobile navigation should dismiss the overlay.
  useEffect(() => closeMobile(), [pathname, closeMobile]);

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: collapsed ? RAIL_WIDTH : EXPANDED_WIDTH,
        breakpoint: "md",
        // Below `md` navigation moves into the Drawer below, which gives us an
        // overlay, tap-outside-to-close and Escape for free.
        collapsed: { mobile: true },
      }}
      padding={{ base: "sm", sm: "md", lg: "lg" }}
    >
      <AppShell.Header withBorder>
        <AppHeader mobileOpened={mobileOpened} onMobileToggle={toggleMobile} />
      </AppShell.Header>

      <AppShell.Navbar withBorder>
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
      </AppShell.Navbar>

      {!isDesktop && (
        <Drawer
          opened={mobileOpened}
          onClose={closeMobile}
          position="left"
          size={EXPANDED_WIDTH}
          padding={0}
          withCloseButton={false}
          overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
          // The theme defaults this component to a right hand form drawer; the
          // navigation needs a plain full height panel instead.
          styles={{
            content: { display: "flex", flexDirection: "column" },
            body: { flex: 1, minHeight: 0, padding: 0 },
          }}
          aria-label="Navigation"
        >
          <AppSidebar onNavigate={closeMobile} />
        </Drawer>
      )}

      {/*
        No max-width wrapper here: capping and centring the content left dead
        gutters either side, which got worse the moment the sidebar collapsed
        to its rail. The page fills whatever width the shell gives it.
      */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AppLayout;
