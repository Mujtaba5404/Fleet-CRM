/**
 * Shared form contract for the add and edit depreciation forms.
 */

export const DEPRECIATION_METHODS = {
  STRAIGHT_LINE: "STRAIGHT_LINE",
  DECLINING_BALANCE: "DECLINING_BALANCE",
};

export const DEPRECIATION_METHOD_OPTIONS = [
  {
    value: DEPRECIATION_METHODS.STRAIGHT_LINE,
    label: "Straight line",
    color: "blue",
    description: "The same amount is written off every month",
  },
  {
    value: DEPRECIATION_METHODS.DECLINING_BALANCE,
    label: "Declining balance",
    color: "grape",
    description: "A fixed yearly rate of what is left, so more early on",
  },
];

/** Unknown methods still render, as their raw value in gray. */
export const getDepreciationMethod = (value) =>
  DEPRECIATION_METHOD_OPTIONS.find((option) => option.value === value) ?? {
    value,
    label: value || "—",
    color: "gray",
  };

export const DEPRECIATION_INITIAL_VALUES = {
  fleet: "",
  method: DEPRECIATION_METHODS.STRAIGHT_LINE,
  acquisitionCost: "",
  salvageValue: "",
  usefulLifeMonths: "",
  depreciationRate: "",
  startDate: null,
};

const isBlank = (value) =>
  value === null || value === undefined || value === "";

const required = (message) => (value) => (isBlank(value) ? message : null);

export const DEPRECIATION_VALIDATION = {
  fleet: required("Vehicle is required"),
  method: required("Pick a method"),
  startDate: required("Start date is required"),
  acquisitionCost: (value) =>
    isBlank(value) || Number(value) <= 0
      ? "Acquisition cost must be more than 0"
      : null,
  salvageValue: (value, values) => {
    if (isBlank(value) || Number(value) < 0) return "Salvage value is required";

    return !isBlank(values.acquisitionCost) &&
      Number(value) > Number(values.acquisitionCost)
      ? "Salvage value cannot be more than the acquisition cost"
      : null;
  },
  usefulLifeMonths: (value) =>
    isBlank(value) || !Number.isInteger(Number(value)) || Number(value) < 1
      ? "Useful life must be at least 1 month"
      : null,
  depreciationRate: (value, values) => {
    if (isBlank(value))
      return values.method === DEPRECIATION_METHODS.DECLINING_BALANCE
        ? "Declining balance needs a rate"
        : null;

    return Number(value) < 0 || Number(value) > 100
      ? "Rate must be between 0 and 100"
      : null;
  },
};

const toId = (value) => value?._id ?? value ?? null;

/** The API sends midnight UTC; the calendar day is all that matters. */
export const toDateString = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);

  const date = new Date(value);
  const pad = (number) => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const depreciationToFormValues = (depreciation = {}) => ({
  fleet: toId(depreciation.fleet) || "",
  method: depreciation.method ?? DEPRECIATION_METHODS.STRAIGHT_LINE,
  acquisitionCost: depreciation.acquisitionCost ?? "",
  salvageValue: depreciation.salvageValue ?? "",
  usefulLifeMonths: depreciation.usefulLifeMonths ?? "",
  depreciationRate: depreciation.depreciationRate ?? "",
  startDate: toDateString(depreciation.startDate),
});

/** Form values → the body POST and PATCH /depreciations expect. */
export const formValuesToPayload = (values) => ({
  fleet: values.fleet,
  method: values.method,
  acquisitionCost: Number(values.acquisitionCost),
  salvageValue: Number(values.salvageValue),
  usefulLifeMonths: Number(values.usefulLifeMonths),
  // Optional for straight line: leave it out rather than send an empty one.
  ...(!isBlank(values.depreciationRate) && {
    depreciationRate: Number(values.depreciationRate),
  }),
  startDate: toDateString(values.startDate),
});
