import {
  IconBox,
  IconBuildingStore,
  IconCar,
  IconListDetails,
  IconPaperclip,
  IconReceiptTax,
  IconShieldCheck,
  IconShieldLock,
  IconTool,
  IconTrendingDown,
  IconUser,
  IconUserShield,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react";
import SCOPE from "../../constants/SCOPE";

export const ACTIONS = ["create", "read", "update", "delete"];

/**
 * Every resource the API currently guards, with the fields an `update`
 * permission can be narrowed to.
 *
 * The server does not expose this list, so it lives here. `buildCatalog`
 * merges in whatever existing roles already reference, so a resource added on
 * the backend still shows up (with a generic icon) before this file catches up.
 */
export const RESOURCE_CATALOG = [
  {
    resource: "Access",
    icon: IconUserShield,
    description: "Which Central users can use Fleet, and with which roles",
    fields: ["user", "roles", "isActive"],
  },
  {
    resource: "Attachment",
    icon: IconPaperclip,
    description: "Files uploaded against any record",
    fields: [
      "resource",
      "resourceId",
      "originalName",
      "fileName",
      "mimeType",
      "size",
      "filePath",
      "uploadedBy",
      "createdAt",
    ],
  },
  {
    resource: "Depreciation",
    icon: IconTrendingDown,
    description: "How vehicle value is written down over time",
    fields: [
      "fleet",
      "method",
      "acquisitionCost",
      "salvageValue",
      "usefulLifeMonths",
      "depreciationRate",
      "startDate",
    ],
  },
  {
    resource: "Fleet",
    icon: IconCar,
    description: "Vehicles, their cost, odometer and assignment",
    fields: [
      "make",
      "model",
      "year",
      "type",
      "fuelType",
      "transmission",
      "color",
      "licensePlate",
      "purchaseAmount",
      "purchaseDate",
      "rent",
      "initialOdometer",
      "currentOdometer",
      "status",
      "condition",
      "company",
      "driverDetails",
      "assignedOn",
      "inspector",
    ],
  },
  {
    resource: "Insurance",
    icon: IconShieldCheck,
    description: "Policies, coverage and renewals",
    fields: [
      "fleet",
      "policyNumber",
      "provider",
      "status",
      "startDate",
      "endDate",
      "cancellationDate",
      "cancellationReason",
      "premium",
      "coverage",
      "notes",
    ],
  },
  {
    resource: "Maintenance",
    icon: IconTool,
    description: "Service jobs, checklists and photos",
    fields: [
      "fleet",
      "type",
      "status",
      "priority",
      "vendor",
      "startDate",
      "endDate",
      "odometer",
      "cost",
      "checklist",
      "notes",
    ],
  },
  {
    resource: "Picklist",
    icon: IconListDetails,
    description: "Dropdown values used across the CRM",
    fields: [
      "title",
      "value",
      "acronym",
      "preserveTitleFormatting",
      "scope",
      "resource",
      "field",
      "parentPicklist",
      "color",
      "order",
      "isDefault",
      "isActive",
      "meta",
      "createdAt",
    ],
  },
  {
    resource: "Role",
    icon: IconShieldLock,
    description: "Roles and the permissions they grant",
    fields: ["title", "permissions", "scope", "indexPath", "createdAt"],
  },
  {
    resource: "Taxation",
    icon: IconReceiptTax,
    description: "Challans, filings and jurisdictions",
    fields: [
      "fleet",
      "company",
      "challanNumber",
      "jurisdiction",
      "status",
      "startDate",
      "endDate",
      "filingDate",
      "amount",
      "notes",
    ],
  },
];

/** Ordered narrowest to widest, which is also the order the picker shows. */
export const SCOPE_OPTIONS = [
  {
    value: SCOPE.OWN,
    label: "Own",
    description: "Only records they created or are assigned to",
    icon: IconUser,
    color: "gray",
  },
  {
    value: SCOPE.BRAND,
    label: "Brand",
    description: "Every record in the brands they belong to",
    icon: IconBuildingStore,
    color: "violet",
  },
  {
    value: SCOPE.COMPANY,
    label: "Company",
    description: "Every record across the companies they belong to",
    icon: IconUsersGroup,
    color: "teal",
  },
  {
    value: SCOPE.ALL,
    label: "All",
    description: "Every record in the system, regardless of company",
    icon: IconWorld,
    color: "orange",
  },
];

export const getScopeOption = (scope) =>
  SCOPE_OPTIONS.find((option) => option.value === scope);

/** "licensePlate" → "License plate", "imgUrl" → "Img url". */
export const humanize = (value = "") => {
  const spaced = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase();

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

const genericEntry = (resource) => ({
  resource,
  icon: IconBox,
  description: `${humanize(resource)} records`,
  fields: [],
});

/**
 * The static catalog, corrected by `resources` (the API's own list from
 * `roles/resources`, whose fields win), plus any resource or field that the
 * given roles mention, so nothing a role grants is ever hidden.
 */
export const buildCatalog = (roles = [], resources = []) => {
  const catalog = new Map(
    RESOURCE_CATALOG.map((entry) => [
      entry.resource,
      { ...entry, fields: [...entry.fields] },
    ]),
  );

  resources.forEach(({ resource, allowedUpdateFields }) => {
    if (!resource) return;

    catalog.set(resource, {
      ...(catalog.get(resource) ?? genericEntry(resource)),
      fields: [...(allowedUpdateFields ?? [])],
    });
  });

  roles.forEach((role) =>
    role?.permissions?.forEach(({ resource, allowedUpdateFields = [] }) => {
      if (!resource) return;

      if (!catalog.has(resource)) catalog.set(resource, genericEntry(resource));

      const entry = catalog.get(resource);
      allowedUpdateFields.forEach((field) => {
        if (!entry.fields.includes(field)) entry.fields.push(field);
      });
    }),
  );

  return [...catalog.values()].sort((a, b) =>
    a.resource.localeCompare(b.resource),
  );
};

/** "Full access", "Read only", "Create, read" … */
export const describeActions = (actions = []) => {
  if (!actions.length) return "No access";
  if (actions.length === ACTIONS.length) return "Full access";
  if (actions.length === 1 && actions[0] === "read") return "Read only";

  return humanize(ACTIONS.filter((a) => actions.includes(a)).join(", "));
};

/** Each action is granted or revoked on its own, kept in `ACTIONS` order. */
export const nextActions = (current, action, checked) => {
  if (!checked) return current.filter((a) => a !== action);

  const next = new Set([...current, action]);
  return ACTIONS.filter((a) => next.has(a));
};

export const EMPTY_PERMISSION = { actions: [], fields: [] };

export const ROLE_INITIAL_VALUES = {
  title: "",
  scope: SCOPE.OWN,
  indexPath: "/",
  // Keyed by resource name, so a row can be read and written by path.
  permissions: {},
};

export const ROLE_VALIDATION = {
  title: (value) => (value?.trim() ? null : "Give the role a name"),
  scope: (value) => (value ? null : "Choose how much data this role can see"),
  indexPath: (value) =>
    !value || value.startsWith("/") ? null : "Paths start with a /",
  permissions: (value) =>
    Object.values(value || {}).some((p) => p.actions?.length)
      ? null
      : "Grant at least one permission",
};

export const roleToFormValues = (role) => ({
  title: role?.title ?? "",
  scope: role?.scope ?? SCOPE.OWN,
  indexPath: role?.indexPath ?? "/",
  permissions: Object.fromEntries(
    (role?.permissions ?? []).map((p) => [
      p.resource,
      {
        actions: ACTIONS.filter((action) => p.actions?.includes(action)),
        fields: p.allowedUpdateFields ?? [],
      },
    ]),
  ),
});

/**
 * Form values → the body POST and PATCH /roles expect. Who holds a role is set
 * on the Access page, not here.
 */
export const formValuesToPayload = (values) => ({
  title: values.title.trim(),
  scope: values.scope,
  indexPath: values.indexPath?.trim() || "/",
  permissions: Object.entries(values.permissions)
    .filter(([, permission]) => permission.actions.length)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([resource, permission]) => ({
      resource,
      actions: ACTIONS.filter((action) => permission.actions.includes(action)),
      allowedUpdateFields: permission.fields,
    })),
});

/**
 * Headline numbers for a role, measured against the catalog so "full access"
 * means every action on every resource that exists, not just the ones listed.
 */
export const summarizeRole = (role, catalog) => {
  const byResource = new Map(
    (role?.permissions ?? []).map((p) => [p.resource, p]),
  );

  let granted = 0;
  let fullAccess = 0;
  let readOnly = 0;
  let editableFields = 0;

  byResource.forEach((p) => {
    const actions = p.actions ?? [];
    granted += actions.length;

    if (ACTIONS.every((action) => actions.includes(action))) fullAccess += 1;
    if (actions.length === 1 && actions[0] === "read") readOnly += 1;
    if (actions.includes("update"))
      editableFields += p.allowedUpdateFields?.length ?? 0;
  });

  const resources = [...byResource.values()].filter((p) => p.actions?.length);

  return {
    granted,
    total: catalog.length * ACTIONS.length,
    resources: resources.length,
    totalResources: catalog.length,
    fullAccess,
    readOnly,
    editableFields,
  };
};
