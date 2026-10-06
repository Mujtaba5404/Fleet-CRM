import { ActionIcon, ScrollArea, Stack, Tooltip } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconTruck,
} from "@tabler/icons-react";
import CanAccess from "../components/CanAccess";
import Logo from "../components/Logo";
import AppSidebarLink from "./AppSidebarLink";
import { NAV_SECTIONS } from "./navigation";
import classes from "./Appsidebar.module.css";


const Guard = ({ resource, children }) => {
  const [auth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });

  if (!resource || !auth?.effectivePermissions?.length) return children;

  return (
    <CanAccess resource={resource} action="read">
      {children}
    </CanAccess>
  );
};


const AppSidebar = ({ collapsed = false, onToggle, onNavigate }) => (
  <div className={classes.sidebar} data-collapsed={collapsed}>
    {onToggle && (
      <Tooltip
        label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        position="right"
        withArrow
      >
        <ActionIcon
          className={classes.collapseHandle}
          size={24}
          radius="xl"
          variant="default"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <IconChevronRight size={14} />
          ) : (
            <IconChevronLeft size={14} />
          )}
        </ActionIcon>
      </Tooltip>
    )}

    <div className={classes.brand}>
      {collapsed ? (
        // The wordmark cannot survive a 76px rail, so fall back to the mark.
        <span className={classes.brandMark}>
          <IconTruck size={20} stroke={1.8} />
        </span>
      ) : (
        <Logo w={150} alt="FleetCRM" />
      )}
    </div>

    <ScrollArea className={classes.nav} scrollbarSize={4} type="hover">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <div className={classes.sectionLabel}>{section.label}</div>

          <Stack gap={2}>
            {section.links.map((link) => (
              <Guard key={link.path} resource={link.resource}>
                <AppSidebarLink
                  link={link}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </Guard>
            ))}
          </Stack>
        </div>
      ))}
    </ScrollArea>
  </div>
);

export default AppSidebar;
