/**
 * Shared form contract for the add and edit fleet drawers.
 *
 * Both drawers previously duplicated the field list and neither validated
 * anything — `required` was decoration, so an empty form still hit the API.
 */

export const FLEET_INITIAL_VALUES = {
  make: null,
  model: null,
  year: "",
  type: null,
  fuelType: null,
  transmission: null,
  color: "",
  licensePlate: "",
  purchaseAmount: "",
  purchaseDate: null,
  rent: "",
  initialOdometer: "",
  currentOdometer: "",
  status: null,
  condition: null,
  company: null,
  assignedTo: null,
  assignedOn: null,
  inspector: null,
};

const required = (message) => (value) =>
  value === null || value === undefined || value === "" ? message : null;

const CURRENT_YEAR = new Date().getFullYear();

export const FLEET_VALIDATION = {
  make: required("Pick a make"),
  model: required("Pick a model"),
  type: required("Pick a type"),
  fuelType: required("Pick a fuel type"),
  transmission: required("Pick a transmission"),
  status: required("Pick a status"),
  condition: required("Pick a condition"),
  licensePlate: (value) =>
    !value?.trim() ? "License plate is required" : null,
  purchaseAmount: required("Purchase amount is required"),
  purchaseDate: required("Purchase date is required"),
  year: (value) => {
    if (value === "" || value === null || value === undefined) return null;

    const year = Number(value);

    // Allow next year's models, which dealers register ahead of time.
    return year < 1900 || year > CURRENT_YEAR + 1
      ? `Enter a year between 1900 and ${CURRENT_YEAR + 1}`
      : null;
  },
  currentOdometer: (value, values) => {
    if (value === "" || value === null || value === undefined) return null;
    if (values.initialOdometer === "" || values.initialOdometer === null)
      return null;

    return Number(value) < Number(values.initialOdometer)
      ? "Cannot be lower than the initial reading"
      : null;
  },
};

const toId = (value) => value?._id ?? value ?? null;
const toDate = (value) => (value ? new Date(value) : null);

/** getById returns populated picklist objects; the form only wants ids. */
export const fleetToFormValues = (fleet = {}) => ({
  make: toId(fleet.make),
  model: toId(fleet.model),
  year: fleet.year ?? "",
  type: toId(fleet.type),
  fuelType: toId(fleet.fuelType),
  transmission: toId(fleet.transmission),
  color: fleet.color || "",
  licensePlate: fleet.licensePlate || "",
  purchaseAmount: fleet.purchaseAmount ?? "",
  purchaseDate: toDate(fleet.purchaseDate),
  rent: fleet.rent ?? "",
  initialOdometer: fleet.initialOdometer ?? "",
  currentOdometer: fleet.currentOdometer ?? "",
  status: toId(fleet.status),
  condition: toId(fleet.condition),
  company: toId(fleet.company) || null,
  assignedTo: toId(fleet.assignedTo) || null,
  assignedOn: toDate(fleet.assignedOn),
  inspector: toId(fleet.inspector) || null,
});
