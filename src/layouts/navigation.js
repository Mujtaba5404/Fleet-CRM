import {
  IconCar,
  IconChartHistogram,
  IconListDetails,
  IconReceiptTax,
  IconShieldCheck,
  IconShieldLock,
  IconTool,
  IconTrendingDown,
} from "@tabler/icons-react";
import RESOURCES from "../constants/RESOURCES";

/**
 * Each link shows only for users who can `read` its `resource`. A list of
 * resources means any one of them is enough.
 */
export const NAV_SECTIONS = [
  {
    label: "Overview",
    links: [
      {
        title: "Summary",
        path: "/summary",
        icon: IconChartHistogram,
        description: "Fleet health, mix and summary charts",
        // Almost every band on the summary is vehicle data.
        resource: RESOURCES.FLEET,
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
        resource: RESOURCES.FLEET,
      },
      {
        title: "Maintenance",
        path: "/maintenance",
        icon: IconTool,
        description: "Service jobs, checklists and photos",
        resource: RESOURCES.MAINTENANCE,
      },
      {
        title: "Insurance",
        path: "/insurance",
        icon: IconShieldCheck,
        description: "Policies, coverage and renewals",
        resource: RESOURCES.INSURANCE,
      },
      {
        title: "Tax",
        path: "/tax",
        icon: IconReceiptTax,
        description: "Challans, filings and jurisdictions",
        resource: RESOURCES.TAXATION,
      },
      {
        title: "Depreciation",
        path: "/depreciations",
        icon: IconTrendingDown,
        description: "How each vehicle's value falls over time",
        resource: RESOURCES.DEPRECIATION,
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
        resource: RESOURCES.PICKLIST,
      },
      {
        title: "Roles",
        path: "/admin-settings/roles",
        icon: IconShieldLock,
        description: "Who can see and change what",
        resource: RESOURCES.ROLE,
      },
    ],
  },
];

export const ALL_NAV_LINKS = NAV_SECTIONS.flatMap((section) => section.links);

export const HOME_PATH = "/summary";

/** Longest matching nav link for a pathname, so `/fleets/123` still resolves to Vehicles. */
export const findNavLink = (pathname) =>
  ALL_NAV_LINKS.filter(
    (link) => pathname === link.path || pathname.startsWith(`${link.path}/`),
  ).sort((a, b) => b.path.length - a.path.length)[0];
