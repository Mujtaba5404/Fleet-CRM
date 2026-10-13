import { ActionIcon, ScrollArea, Stack, Tooltip } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconTruck,
} from "@tabler/icons-react";
import Logo from "../components/Logo";
import { usePermissions } from "../hooks/useCanAccess";
import AppSidebarLink from "./AppSidebarLink";
import { NAV_SECTIONS } from "./navigation";
import classes from "./Appsidebar.module.css";

const AppSidebar = ({ collapsed = false, onToggle, onNavigate }) => {
  const can = usePermissions();

  // Only links the role can read; a section left with none is dropped too.
  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    links: section.links.filter((link) => can(link.resource, "read")),
  })).filter((section) => section.links.length);

  return (
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
        {sections.map((section) => (
          <div key={section.label}>
            <div className={classes.sectionLabel}>{section.label}</div>

            <Stack gap={2}>
              {section.links.map((link) => (
                <AppSidebarLink
                  key={link.path}
                  link={link}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </Stack>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default AppSidebar;
