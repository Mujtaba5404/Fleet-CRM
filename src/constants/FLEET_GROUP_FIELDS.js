/**
 * Fleet fields the summary endpoint can group by.
 *
 * These are the picklist-backed fields on a vehicle, so every one of them
 * returns a `{ title, color }` the summary can render as a badge.
 */
const FLEET_GROUP_FIELDS = [
  { value: "make", label: "Make" },
  { value: "model", label: "Model" },
  { value: "type", label: "Type" },
  { value: "fuelType", label: "Fuel type" },
  { value: "transmission", label: "Transmission" },
  { value: "status", label: "Status" },
  { value: "condition", label: "Condition" },
];

export const DEFAULT_PRIMARY_GROUP = "fuelType";
export const DEFAULT_SECONDARY_GROUP = "type";

export const groupFieldLabel = (value) =>
  FLEET_GROUP_FIELDS.find((field) => field.value === value)?.label ?? value;

export default FLEET_GROUP_FIELDS;
