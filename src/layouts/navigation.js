import {
  IconCar,
  IconChartPie,
  IconLayoutDashboard,
  IconListDetails,
  IconReceiptTax,
  IconShieldCheck,
  IconShieldLock,
  IconTool,
} from "@tabler/icons-react";

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
      {
        title: "Summary",
        path: "/fleets/summary",
        icon: IconChartPie,
        description: "Counts and value, grouped",
        resource: "fleet",
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
      {
        title: "Roles",
        path: "/admin-settings/roles",
        icon: IconShieldLock,
        description: "Who can see and change what",
        resource: "role",
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
