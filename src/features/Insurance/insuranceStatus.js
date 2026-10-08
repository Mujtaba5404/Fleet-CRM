import { IconBan, IconCalendarOff, IconShieldCheck } from "@tabler/icons-react";
import ENUMS from "../../constants/ENUMS";

const { STATUSES } = ENUMS.INSURANCE;

/** Policy status is an enum on the API, not a picklist. */
export const INSURANCE_STATUS_OPTIONS = [
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

/** Shown for a policy with no status: it is simply in force. */
export const ACTIVE_STATUS_OPTION = {
  value: null,
  label: "Active",
  color: "teal",
  icon: IconShieldCheck,
};

export const getInsuranceStatusOption = (status) =>
  INSURANCE_STATUS_OPTIONS.find((option) => option.value === status);

/**
 * Status as the enum value, or null. Policies saved while status was a
 * picklist come back as `{ title, ... }`; anything unrecognised becomes null
 * so the form never sends a value the API rejects.
 */
export const toInsuranceStatus = (status) => {
  const raw =
    typeof status === "object" ? status?.value || status?.title : status;
  const value = raw?.toString().trim().toLowerCase();

  return Object.values(STATUSES).includes(value) ? value : null;
};

/**
 * What to show for a policy: its saved status, otherwise what its dates say
 * (a cancellation date or a past end date), otherwise Active.
 */
export const getEffectiveInsuranceStatus = (insurance = {}) => {
  const saved = getInsuranceStatusOption(toInsuranceStatus(insurance.status));

  if (saved) return saved;

  if (insurance.cancellationDate)
    return getInsuranceStatusOption(STATUSES.CANCELLED);

  if (insurance.endDate && new Date(insurance.endDate) < new Date())
    return getInsuranceStatusOption(STATUSES.EXPIRED);

  return ACTIVE_STATUS_OPTION;
};
