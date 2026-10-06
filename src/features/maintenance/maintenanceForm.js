/**
 * Shared form contract for the add and edit maintenance drawers.
 */
import { IconCircleCheck, IconPlayerPlay } from "@tabler/icons-react";
import dayjs from "dayjs";
import ENUMS from "../../constants/ENUMS";

const { STATUSES } = ENUMS.MAINTENANCE;

export const MAINTENANCE_STATUS_OPTIONS = [
  {
    value: STATUSES.INITIATED,
    label: "Initiated",
    color: "blue",
    icon: IconPlayerPlay,
  },
  {
    value: STATUSES.COMPLETED,
    label: "Completed",
    color: "teal",
    icon: IconCircleCheck,
  },
];

export const getMaintenanceStatusOption = (status) =>
  MAINTENANCE_STATUS_OPTIONS.find((option) => option.value === status);

export const isCompleted = (status) => status === STATUSES.COMPLETED;

/**
 * Status as the enum value. Jobs logged while status was still a picklist come
 * back as `{ title, ... }`; anything unrecognised starts as Initiated so the
 * dropdown always has a valid selection.
 */
const toStatus = (status) => {
  const raw =
    typeof status === "object" ? status?.value || status?.title : status;
  const value = raw?.toString().trim().toLowerCase();

  return Object.values(STATUSES).includes(value) ? value : STATUSES.INITIATED;
};

/**
 * Only the photo set the status shows is sent: before for an Initiated job,
 * after for a Completed one. Picks left in the hidden set are dropped.
 */
export const photosForStatus = (status, photos) =>
  isCompleted(status)
    ? { conditionAfter: photos.conditionAfter }
    : { conditionBefore: photos.conditionBefore };

export const EMPTY_CHECKLIST_ITEM = {
  item: null,
  condition: null,
};

export const MAINTENANCE_INITIAL_VALUES = {
  fleet: null,
  type: null,
  status: STATUSES.INITIATED,
  priority: null,
  vendor: null,
  startDate: new Date(),
  endDate: null,
  odometer: "",
  cost: "",
  checklist: [{ ...EMPTY_CHECKLIST_ITEM }],
  notes: "",
};

const required = (message) => (value) =>
  value === null || value === undefined || value === "" ? message : null;

export const MAINTENANCE_VALIDATION = {
  fleet: required("Vehicle is required"),
  type: required("Pick a type"),
  status: required("Pick a status"),
  priority: required("Pick a priority"),
  startDate: required("Start date is required"),
  endDate: (value, values) => {
    if (!value)
      return isCompleted(values.status)
        ? "A completed job needs an end date"
        : null;
    if (!values.startDate) return null;

    return dayjs(value).isBefore(dayjs(values.startDate), "day")
      ? "Cannot be before the start date"
      : null;
  },
  odometer: required("Odometer reading is required"),
};

const toId = (value) => value?._id ?? value ?? null;
const toDate = (value) => (value ? new Date(value) : null);

export const maintenanceToFormValues = (job = {}) => ({
  fleet: toId(job.fleet),
  type: toId(job.type),
  status: toStatus(job.status),
  priority: toId(job.priority),
  vendor: toId(job.vendor),
  startDate: toDate(job.startDate),
  endDate: toDate(job.endDate),
  odometer: job.odometer ?? "",
  cost: job.cost ?? "",
  checklist: job.checklist?.length
    ? job.checklist.map((row) => ({
        item: toId(row.item),
        condition: toId(row.condition),
      }))
    : [{ ...EMPTY_CHECKLIST_ITEM }],
  notes: job.notes || "",
});

/**
 * Form values plus newly picked photos → the multipart body the API expects.
 *
 * Checklist rows go over as `checklist[0].item` / `checklist[0].condition`,
 * and each photo is appended under its own field so the server can tell the
 * before shots from the after shots.
 */
export const maintenanceToFormData = (
  { checklist, ...values },
  { conditionBefore = [], conditionAfter = [] } = {},
) => {
  const formData = new FormData();

  // Empty optionals are left out: an empty string is not a valid id or date.
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    formData.append(
      key,
      value instanceof Date || key.endsWith("Date")
        ? dayjs(value).toISOString()
        : value,
    );
  });

  checklist
    .filter((row) => row.item)
    .forEach((row, index) => {
      formData.append(`checklist[${index}].item`, row.item);
      if (row.condition)
        formData.append(`checklist[${index}].condition`, row.condition);
    });

  conditionBefore.forEach((file) => formData.append("conditionBefore", file));
  conditionAfter.forEach((file) => formData.append("conditionAfter", file));

  return formData;
};
