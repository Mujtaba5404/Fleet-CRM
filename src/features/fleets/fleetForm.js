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
  user: null,
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
    user: whenAssigned(required("Pick the user")),
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
    // Older records stored the person under `driver`.
    user:
      toId(fleet.driverDetails?.user ?? fleet.driverDetails?.driver) || null,
    licenseNumber: fleet.driverDetails?.licenseNumber || "",
    licenseExpiry: fleet.driverDetails?.licenseExpiry
      ? dayjs(fleet.driverDetails.licenseExpiry).format("YYYY-MM-DD")
      : null,
  },
  assignedOn: toDate(fleet.assignedOn),
  inspector: toId(fleet.inspector) || null,
});

/** Fields the API computes with, so they must arrive as numbers. */
const NUMBER_FIELDS = [
  "year",
  "purchaseAmount",
  "rent",
  "initialOdometer",
  "currentOdometer",
];

const DATE_FIELDS = ["purchaseDate", "assignedOn"];

const isEmpty = (value) =>
  value === undefined || value === null || value === "";

const toDay = (value) => dayjs(value).format("YYYY-MM-DD");

/**
 * Form values → the vehicle as the API should receive it: numbers as
 * numbers, dates as "YYYY-MM-DD", and empty optionals (an unpicked inspector,
 * no rent) left out entirely, so the server sees `undefined` rather than "".
 * Driver details are included only for an assigned vehicle.
 */
const toFleetBody = (values) => {
  const { driverDetails, ...rest } = values;
  const assigned = isAssignedStatus(values.status);
  const body = {};

  Object.entries(rest).forEach(([key, value]) => {
    if (isEmpty(value)) return;
    if (key === "assignedOn" && !assigned) return;

    if (NUMBER_FIELDS.includes(key)) body[key] = Number(value);
    else if (DATE_FIELDS.includes(key)) body[key] = toDay(value);
    else body[key] = value;
  });

  if (assigned) {
    body.driverDetails = {
      user: driverDetails.user,
      licenseNumber: driverDetails.licenseNumber.trim(),
      licenseExpiry: toDay(driverDetails.licenseExpiry),
    };
  }

  return body;
};

/**
 * The request body for create / update.
 *
 * Without new files it is plain JSON, which is the only way numbers reach the
 * server as numbers. With files it has to be multipart, where every value is a
 * string by definition; there the server's validator must coerce them.
 * Nested driver details then go in bracket notation (`driverDetails[user]`),
 * which multipart parsers rebuild into an object.
 */
export const fleetToPayload = (values, attachments = []) => {
  const body = toFleetBody(values);

  if (!attachments.length) return body;

  const { driverDetails, ...flat } = body;
  const formData = toFormData(flat, attachments);

  Object.entries(driverDetails ?? {}).forEach(([key, value]) =>
    formData.append(`driverDetails[${key}]`, value),
  );

  return formData;
};
