/**
 * Shared form contract for the add and edit insurance drawers.
 */
import { toInsuranceStatus } from "./insuranceStatus";

export const INSURANCE_INITIAL_VALUES = {
  fleet: null,
  policyNumber: "",
  provider: null,
  status: null,
  startDate: null,
  endDate: null,
  cancellationDate: null,
  cancellationReason: "",
  premium: "",
  coverage: "",
  notes: "",
};

const required = (message) => (value) =>
  value === null || value === undefined || value === "" ? message : null;

export const INSURANCE_VALIDATION = {
  policyNumber: (value) =>
    !value?.trim() ? "Policy number is required" : null,
  fleet: required("Vehicle is required"),
  provider: required("Pick a provider"),
  // Status is optional: empty means the policy is active.
  startDate: required("Start date is required"),
  premium: required("Premium is required"),
  coverage: required("Coverage limit is required"),
  endDate: (value, values) => {
    if (!value) return "End date is required";
    if (!values.startDate) return null;

    return new Date(value) < new Date(values.startDate)
      ? "Cover cannot end before it starts"
      : null;
  },
  cancellationReason: (value, values) =>
    values.cancellationDate && !value?.trim()
      ? "Give a reason when cancelling"
      : null,
};

/**
 * Form values as the API takes them. An empty status is left out rather than
 * sent as null, unless it is clearing a status the policy already had.
 */
export const insuranceToPayload = (values, previous = {}) => {
  const { status, ...rest } = values;

  if (status) return { ...rest, status };

  return toInsuranceStatus(previous.status) ? { ...rest, status: null } : rest;
};

const toId = (value) => value?._id ?? value ?? null;
const toDate = (value) => (value ? new Date(value) : null);

export const insuranceToFormValues = (insurance = {}) => ({
  fleet: toId(insurance.fleet),
  policyNumber: insurance.policyNumber || "",
  provider: toId(insurance.provider),
  status: toInsuranceStatus(insurance.status),
  startDate: toDate(insurance.startDate),
  endDate: toDate(insurance.endDate),
  cancellationDate: toDate(insurance.cancellationDate),
  cancellationReason: insurance.cancellationReason || "",
  premium: insurance.premium ?? insurance.totalPremium ?? "",
  coverage: insurance.coverage ?? "",
  notes: insurance.notes || "",
});
