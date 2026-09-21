import { Badge, Box, Indicator, Menu, NavLink, Tooltip } from "@mantine/core";
import { Link, matchPath, useLocation } from "react-router-dom";

const isMatch = (path, pathname) => !!matchPath({ path, end: false }, pathname);
const radius = "var(--mantine-radius-md)";
const expandedStyles = { root: { borderRadius: radius, height: 42 }, label: { fontWeight: 500 } };
const collapsedStyles = { root: { borderRadius: radius, width: 44, height: 44, justifyContent: "center" }, section: { margin: 0 }, body: { display: "none" } };
const timeline = { root: { borderRadius: radius, height: 36 }, children: { marginInlineStart: 22, paddingInlineStart: 8, borderInlineStart: "1px solid var(--mantine-color-default-border)" } };

const AppSidebarLink = ({ link: { title, path, icon: Icon, count = 0, children }, collapsed }) => {
  const { pathname } = useLocation();
  const active = children ? children.some((c) => isMatch(c.path, pathname)) : isMatch(path, pathname);
  const icon = <Icon size={20} stroke={1.6} />;
  const nav = children ? {} : { component: Link, to: path };

  if (collapsed) {
    const trigger = (
      <Indicator disabled={!count} size={8} offset={8}>
        <NavLink {...nav} active={active} variant="filled" leftSection={icon} aria-label={title} styles={collapsedStyles} />
      </Indicator>
    );

    return children ? (
      <Menu trigger="hover" position="right-start" offset={14} withArrow>
        <Menu.Target>{trigger}</Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{title}</Menu.Label>
          {children.map((c) => (
            <Menu.Item key={c.path} component={Link} to={c.path} c={isMatch(c.path, pathname) ? "var(--mantine-primary-color-filled)" : undefined}>{c.title}</Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    ) : (
      <Tooltip label={title} position="right" withArrow offset={14}>{trigger}</Tooltip>
    );
  }

  return (
    <NavLink
      {...nav}
      label={title}
      leftSection={icon}
      active={active}
      variant="filled"
      defaultOpened={active}
      childrenOffset={0}
      styles={children ? { ...expandedStyles, children: timeline.children } : expandedStyles}
      rightSection={!children && count > 0 && <Badge size="sm" circle variant={active ? "white" : "light"}>{count > 9 ? "9+" : count}</Badge>}
    >
      {children?.map((c) => {
        const childActive = isMatch(c.path, pathname);
        return (
          <NavLink
            key={c.path} component={Link} to={c.path} label={c.title} active={childActive} variant="subtle" styles={timeline}
            leftSection={<Box w={7} h={7} bg={childActive ? "var(--mantine-primary-color-filled)" : "var(--mantine-color-default-border)"} style={{ borderRadius: "50%" }} />}
          />
        );
      })}
    </NavLink>
  );
};

export default AppSidebarLink;