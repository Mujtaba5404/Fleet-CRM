import { IconBan, IconCalendarOff, IconRadioactive, IconShieldCheck } from "@tabler/icons-react";
import ENUMS from "../../constants/ENUMS";

const { STATUSES } = ENUMS.INSURANCE;

/** Policy status is an enum on the API, not a picklist. */
export const INSURANCE_STATUS_OPTIONS = [
  {
    value: STATUSES.ACTIVE,
    label: "Active",
    color: "green",
    icon: IconRadioactive,
  },
  {
    value: STATUSES.EXPIRED,
    label: "Expired",
    color: "orange",
    icon: IconCalendarOff,
  },
  {
    value: STATUSES.CANCELLED,
    label: "Cancelled",
    color: "red",
    icon: IconBan,
  },
];


export const ACTIVE_STATUS_OPTION = {
  value: null,
  label: "Active",
  color: "teal",
  icon: IconShieldCheck,
};

export const getInsuranceStatusOption = (status) =>
  INSURANCE_STATUS_OPTIONS.find((option) => option.value === status);


export const toInsuranceStatus = (status) => {
  const raw =
    typeof status === "object" ? status?.value || status?.title : status;
  const value = raw?.toString().trim().toLowerCase();

  return Object.values(STATUSES).includes(value) ? value : null;
};

export const getEffectiveInsuranceStatus = (insurance = {}) => {
  const saved = getInsuranceStatusOption(toInsuranceStatus(insurance.status));

  if (saved) return saved;

  if (insurance.cancellationDate)
    return getInsuranceStatusOption(STATUSES.CANCELLED);

  if (insurance.endDate && new Date(insurance.endDate) < new Date())
    return getInsuranceStatusOption(STATUSES.EXPIRED);

  return ACTIVE_STATUS_OPTION;
};
