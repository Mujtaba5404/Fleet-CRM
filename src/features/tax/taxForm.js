/**
 * Shared form contract for the add and edit tax drawers.
 */

export const TAX_INITIAL_VALUES = {
  company: "",
  fleet: "",
  challanNumber: "",
  jurisdiction: null,
  status: null,
  startDate: null,
  endDate: null,
  filingDate: null,
  taxAmount: "",
  notes: "",
};

const required = (message) => (value) =>
  value === null || value === undefined || value === "" ? message : null;

export const TAX_VALIDATION = {
  challanNumber: (value) =>
    !value?.trim() ? "Challan number is required" : null,
  fleet: required("Vehicle is required"),
  // No company field on the form: the company comes from the vehicle.
  jurisdiction: required("Pick a jurisdiction"),
  status: required("Pick a status"),
  startDate: required("Period start is required"),
  taxAmount: required("Tax amount is required"),
  endDate: (value, values) => {
    if (!value) return "Period end is required";
    if (!values.startDate) return null;

    return new Date(value) < new Date(values.startDate)
      ? "The period cannot end before it starts"
      : null;
  },
};

/** The add form has no status field, so it must not require one. */
// eslint-disable-next-line no-unused-vars
const { status: _status, ...TAX_CREATE_VALIDATION } = TAX_VALIDATION;

export { TAX_CREATE_VALIDATION };

const toId = (value) => value?._id ?? value ?? null;
const toDate = (value) => (value ? new Date(value) : null);

export const taxToFormValues = (tax = {}) => ({
  company: toId(tax.company) || "",
  fleet: toId(tax.fleet) || "",
  challanNumber: tax.challanNumber || "",
  jurisdiction: toId(tax.jurisdiction),
  status: toId(tax.status),
  startDate: toDate(tax.startDate),
  endDate: toDate(tax.endDate),
  filingDate: toDate(tax.filingDate),
  taxAmount: tax.taxAmount ?? "",
  notes: tax.notes || "",
});
