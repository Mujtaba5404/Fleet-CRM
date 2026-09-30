/**
 * Shared form contract for the add and edit maintenance drawers.
 */

export const EMPTY_COMPONENT = {
  component: null,
  quantity: 1,
  unitCost: "",
  totalCost: 0,
};

export const EMPTY_CHECKLIST_ITEM = {
  item: null,
  status: null,
  condition: null,
};

export const MAINTENANCE_INITIAL_VALUES = {
  company: "",
  fleet: "",
  type: null,
  status: null,
  priority: null,
  reportedBy: "",
  assignedTo: "",
  assignedOn: null,
  provider: null,
  startedDate: null,
  endDate: null,
  odometer: "",
  cost: "",
  components: [{ ...EMPTY_COMPONENT }],
  checklist: [{ ...EMPTY_CHECKLIST_ITEM }],
  notes: "",
};

const required = (message) => (value) =>
  value === null || value === undefined || value === "" ? message : null;

export const MAINTENANCE_VALIDATION = {
  fleet: required("Vehicle is required"),
  company: required("Company is required"),
  type: required("Pick a type"),
  status: required("Pick a status"),
  priority: required("Pick a priority"),
  odometer: required("Odometer reading is required"),
  endDate: (value, values) => {
    if (!value || !values.startedDate) return null;

    return new Date(value) < new Date(values.startedDate)
      ? "Completion cannot be before the start date"
      : null;
  },
};

const toId = (value) => value?._id ?? value ?? null;
const toDate = (value) => (value ? new Date(value) : null);

export const maintenanceToFormValues = (job = {}) => ({
  company: toId(job.company) || "",
  fleet: toId(job.fleet) || "",
  type: toId(job.type),
  status: toId(job.status),
  priority: toId(job.priority),
  reportedBy: toId(job.reportedBy) || "",
  assignedTo: toId(job.assignedTo) || "",
  assignedOn: toDate(job.assignedOn),
  provider: toId(job.provider),
  startedDate: toDate(job.startedDate),
  endDate: toDate(job.endDate),
  odometer: job.odometer ?? "",
  cost: job.cost ?? "",
  components: job.components?.length
    ? job.components.map((row) => ({
        component: toId(row.component),
        quantity: row.quantity ?? 1,
        unitCost: row.unitCost ?? "",
        totalCost: row.totalCost ?? 0,
      }))
    : [{ ...EMPTY_COMPONENT }],
  checklist: job.checklist?.length
    ? job.checklist.map((row) => ({
        item: toId(row.item),
        status: toId(row.status),
        condition: toId(row.condition),
      }))
    : [{ ...EMPTY_CHECKLIST_ITEM }],
  notes: job.notes || "",
});
