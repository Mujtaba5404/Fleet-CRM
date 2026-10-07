/**
 * Shared form contract for the add and edit fleet drawers.
 *
 * Both drawers previously duplicated the field list and neither validated
 * anything — `required` was decoration, so an empty form still hit the API.
 */
import dayjs from "dayjs";
import ENUMS from "../../constants/ENUMS";
import toFormData from "../../utils/toFormData";
import { isAssignedStatus, toFleetStatus } from "./fleetStatus";

export const EMPTY_DRIVER_DETAILS = {
  driver: null,
  licenseNumber: "",
  licenseExpiry: null,
};

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
  // An enum on the API; a newly registered vehicle starts in house.
  status: ENUMS.FLEET.STATUSES.IN_HOUSE,
  condition: null,
  company: null,
  // Only used, shown and sent while the status is "assigned".
  driverDetails: { ...EMPTY_DRIVER_DETAILS },
  assignedOn: null,
  inspector: null,
};

const required = (message) => (value) =>
  value === null || value === undefined || value === "" ? message : null;

/** Driver details are only checked for an assigned vehicle. */
const whenAssigned = (rule) => (value, values) =>
  isAssignedStatus(values.status) ? rule(value, values) : null;

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
  driverDetails: {
    driver: whenAssigned(required("Pick the driver")),
    licenseNumber: whenAssigned((value) =>
      value?.trim() ? null : "License number is required",
    ),
    licenseExpiry: whenAssigned((value) => {
      if (!value) return "License expiry is required";

      return dayjs(value).isBefore(dayjs(), "day")
        ? "This license has expired"
        : null;
    }),
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
  status: toFleetStatus(fleet.status),
  condition: toId(fleet.condition),
  company: toId(fleet.company) || null,
  driverDetails: {
    driver: toId(fleet.driverDetails?.driver) || null,
    licenseNumber: fleet.driverDetails?.licenseNumber || "",
    licenseExpiry: fleet.driverDetails?.licenseExpiry
      ? dayjs(fleet.driverDetails.licenseExpiry).format("YYYY-MM-DD")
      : null,
  },
  assignedOn: toDate(fleet.assignedOn),
  inspector: toId(fleet.inspector) || null,
});

/**
 * Form values plus picked files → the multipart body.
 *
 * Driver details go over in bracket notation (`driverDetails[driver]`), which
 * the server's multipart parser rebuilds into an object, and only for an
 * assigned vehicle; the expiry is a plain date ("2029-01-18").
 */
export const fleetToFormData = (values, attachments) => {
  const { driverDetails, ...rest } = values;
  const assigned = isAssignedStatus(values.status);

  const formData = toFormData(
    assigned ? rest : { ...rest, assignedOn: undefined },
    attachments,
  );

  if (assigned) {
    formData.append("driverDetails[driver]", driverDetails.driver);
    formData.append(
      "driverDetails[licenseNumber]",
      driverDetails.licenseNumber.trim(),
    );
    formData.append(
      "driverDetails[licenseExpiry]",
      dayjs(driverDetails.licenseExpiry).format("YYYY-MM-DD"),
    );
  }

  return formData;
};
