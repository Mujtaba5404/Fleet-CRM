import {
  IconCar,
  IconLayoutDashboard,
  IconListDetails,
  IconReceiptTax,
  IconShieldCheck,
  IconTool,
} from "@tabler/icons-react";

/**
 * Single source of truth for the app navigation.
 *
 * Every entry drives three things at once:
 * - the desktop sidebar + mobile navigation drawer
 * - the page header breadcrumbs
 * - the document title
 *
 * `resource` (optional) is checked against the logged in user's permissions
 * with <CanAccess resource={resource} action="read" />.
 */
export const NAV_SECTIONS = [
  {
    label: "Overview",
    links: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: IconLayoutDashboard,
        description: "Fleet health at a glance",
      },
    ],
  },
  {
    label: "Fleet",
    links: [
      {
        title: "Vehicles",
        path: "/fleets",
        icon: IconCar,
        description: "Every vehicle in your fleet",
        resource: "fleet",
      },
      {
        title: "Maintenance",
        path: "/maintenance",
        icon: IconTool,
        description: "Service jobs, parts and checklists",
        resource: "maintenance",
      },
      {
        title: "Insurance",
        path: "/insurance",
        icon: IconShieldCheck,
        description: "Policies, coverage and renewals",
        resource: "insurance",
      },
      {
        title: "Tax",
        path: "/tax",
        icon: IconReceiptTax,
        description: "Challans, filings and jurisdictions",
        resource: "taxation",
      },
    ],
  },
  {
    label: "Configuration",
    links: [
      {
        title: "Picklists",
        path: "/admin-settings/picklists",
        icon: IconListDetails,
        description: "Dropdown values used across the CRM",
        resource: "picklist",
      },
    ],
  },
];

export const ALL_NAV_LINKS = NAV_SECTIONS.flatMap((section) => section.links);

export const HOME_PATH = "/dashboard";

/** Longest matching nav link for a pathname, so `/fleets/123` still resolves to Vehicles. */
export const findNavLink = (pathname) =>
  ALL_NAV_LINKS.filter(
    (link) => pathname === link.path || pathname.startsWith(`${link.path}/`),
  ).sort((a, b) => b.path.length - a.path.length)[0];
