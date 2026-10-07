import { IconHome, IconSteeringWheel, IconTool } from "@tabler/icons-react";
import ENUMS from "../../constants/ENUMS";

const { STATUSES } = ENUMS.FLEET;

/** Vehicle status is an enum on the API, not a picklist. */
export const FLEET_STATUS_OPTIONS = [
  {
    value: STATUSES.IN_HOUSE,
    label: "In house",
    color: "blue",
    icon: IconHome,
  },
  {
    value: STATUSES.ASSIGNED,
    label: "Assigned",
    color: "teal",
    icon: IconSteeringWheel,
  },
  {
    value: STATUSES.IN_MAINTENANCE,
    label: "In maintenance",
    color: "orange",
    icon: IconTool,
  },
];

export const getFleetStatusOption = (status) =>
  FLEET_STATUS_OPTIONS.find((option) => option.value === status);

/**
 * A status as the `{ _id, title, color }` shape charts use for picklist
 * buckets, so status sits beside type and fuel type without special cases.
 * Returns null for a missing or unknown status.
 */
export const toStatusBucket = (status) => {
  const option = getFleetStatusOption(toFleetStatus(status));

  return option
    ? { _id: option.value, title: option.label, color: option.color }
    : null;
};

/** Driver details apply to an assigned vehicle only. */
export const isAssignedStatus = (status) => status === STATUSES.ASSIGNED;

/**
 * Status as the enum value. Vehicles saved while status was a picklist come
 * back as `{ title, value, ... }`; anything unrecognised becomes null so the
 * form asks for a valid one instead of sending a value the API rejects.
 */
export const toFleetStatus = (status) => {
  const raw =
    typeof status === "object" ? status?.value || status?.title : status;
  const value = raw?.toString().trim().toLowerCase().replace(/\s+/g, "_");

  return Object.values(STATUSES).includes(value) ? value : null;
};
