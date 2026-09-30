import { Badge, Text, Tooltip } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import classes from "./Appsidebar.module.css";

/**
 * A single sidebar entry.
 *
 * Active state matches the link path *and* everything nested under it, so a
 * detail route such as `/fleets/64af…` keeps "Vehicles" highlighted.
 */
const AppSidebarLink = ({ link, collapsed = false, onNavigate }) => {
  const { title, path, icon: Icon, description, count = 0 } = link;
  const { pathname } = useLocation();

  const active = pathname === path || pathname.startsWith(`${path}/`);

  const node = (
    <Text
      component={Link}
      to={path}
      onClick={onNavigate}
      className={classes.link}
      data-active={active}
      aria-label={title}
      aria-current={active ? "page" : undefined}
    >
      <span className={classes.linkIcon}>
        <Icon size={20} stroke={1.6} />
      </span>

      {!collapsed && (
        <>
          <span className={classes.linkLabel}>{title}</span>

          {count > 0 && (
            <Badge
              size="sm"
              circle
              ml="auto"
              variant={active ? "filled" : "light"}
            >
              {count > 99 ? "99+" : count}
            </Badge>
          )}
        </>
      )}
    </Text>
  );

  if (collapsed) {
    return (
      <Tooltip label={title} position="right" offset={12} withArrow>
        {node}
      </Tooltip>
    );
  }

  return description ? (
    <Tooltip
      label={description}
      position="right"
      offset={12}
      openDelay={600}
      withArrow
    >
      {node}
    </Tooltip>
  ) : (
    node
  );
};

export default AppSidebarLink;
