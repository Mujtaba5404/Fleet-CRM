import {
  Badge,
  Button,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconCalendarEvent,
  IconCamera,
  IconChecklist,
  IconClipboardText,
  IconFileDescription,
  IconPhotoCheck,
  IconPlus,
  IconTool,
} from "@tabler/icons-react";
import CurrencyInput from "../../components/CurrencyInput";
import FormSection from "../../components/FormSection";
import RepeaterRow from "../../components/RepeaterRow";
import FleetsSelect from "../fleets/FleetsSelect";
import PicklistsSelect from "../picklists/components/PicklistsSelect";
import ConditionPhotosField from "./ConditionPhotosField";
import {
  EMPTY_CHECKLIST_ITEM,
  getMaintenanceStatusOption,
  isCompleted,
  MAINTENANCE_STATUS_OPTIONS,
} from "./maintenanceForm";

const HALF = { base: 12, sm: 6 };

/** Field builders bound to a form instance. */
const useMaintenanceFields = (form) => {
  const picklist = (path, label, { span = HALF, field, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Maintenance", field: field || path }}
        selectProps={{
          label,
          placeholder: `Select ${label.toLowerCase()}`,
          ...props,
          ...form.getInputProps(path),
        }}
      />
    </Grid.Col>
  );

  const date = (path, label, { span = HALF, ...props } = {}) => (
    <Grid.Col span={span}>
      <DateInput
        clearable
        valueFormat="DD MMM YYYY"
        label={label}
        placeholder={`Pick ${label.toLowerCase()}`}
        {...props}
        {...form.getInputProps(path)}
      />
    </Grid.Col>
  );

  return { picklist, date };
};

const StatusIcon = ({ status }) => {
  const option = getMaintenanceStatusOption(status);
  if (!option) return null;

  const Icon = option.icon;
  return (
    <Icon size={16} color={`var(--mantine-color-${option.color}-filled)`} />
  );
};

/** Left column: what the job is and who is doing it. */
export const MaintenanceMainFields = ({ form }) => {
  const { picklist, date } = useMaintenanceFields(form);
  const statusInput = form.getInputProps("status");

  // Completing a job almost always means "today", so fill it in.
  const handleStatusChange = (value) => {
    statusInput.onChange(value);
    if (isCompleted(value) && !form.values.endDate)
      form.setFieldValue("endDate", new Date());
  };

  return (
    <>
      <FormSection
        title="Job"
        description="What is being serviced and how urgent it is"
        icon={IconClipboardText}
      >
        <Grid.Col span={12}>
          <FleetsSelect
            selectProps={{
              withAsterisk: true,
              label: "Vehicle",
              placeholder: "Search by plate, make or model",
              ...form.getInputProps("fleet"),
            }}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Select
            withAsterisk
            label="Status"
            placeholder="Select status"
            searchable={false}
            description={
              isCompleted(statusInput.value)
                ? "Add photos of the vehicle after service on the right."
                : "Add photos of the vehicle before service on the right."
            }
            data={MAINTENANCE_STATUS_OPTIONS.map(({ value, label }) => ({
              value,
              label,
            }))}
            leftSection={<StatusIcon status={statusInput.value} />}
            renderOption={({ option }) => (
              <Group gap="xs" wrap="nowrap">
                <StatusIcon status={option.value} />
                <Text fz="sm">{option.label}</Text>
              </Group>
            )}
            {...statusInput}
            onChange={handleStatusChange}
          />
        </Grid.Col>

        {/* Vendor values are managed under Picklists → Maintenance → Provider. */}
        {picklist("vendor", "Vendor", { span: 12, field: "provider" })}
        {picklist("type", "Type", { withAsterisk: true })}
        {picklist("priority", "Priority", { withAsterisk: true })}

        <Grid.Col span={12}>
          <NumberInput
            withAsterisk
            label="Odometer at service"
            placeholder="3,000"
            min={0}
            thousandSeparator=","
            hideControls
            {...form.getInputProps("odometer")}
          />
        </Grid.Col>
      </FormSection>

      <FormSection
        title="Schedule"
        description="When the vehicle went in and came back"
        icon={IconCalendarEvent}
      >
        {date("startDate", "Start date", { withAsterisk: true })}
        {date("endDate", "End date", {
          withAsterisk: isCompleted(form.values.status),
          minDate: form.values.startDate || undefined,
        })}
      </FormSection>

      <FormSection title="Notes" icon={IconFileDescription} plain>
        <Textarea
          placeholder="Anything the mechanic or next inspector should know"
          autosize
          minRows={3}
          maxRows={8}
          {...form.getInputProps("notes")}
        />
      </FormSection>
    </>
  );
};

/**
 * Vehicle condition photos, driven by status: Initiated shows the "before"
 * set, Completed swaps it for the "after" set.
 *
 * @param {Object}   props
 * @param {Object}   props.form
 * @param {{conditionBefore: File[], conditionAfter: File[]}} props.photos
 * @param {Function} props.onPhotosChange (field, files) => void
 * @param {Object}   [props.job]           Saved job, for its existing photos.
 */
export const MaintenancePhotoFields = ({
  form,
  photos,
  onPhotosChange,
  job,
}) =>
  isCompleted(form.values.status) ? (
    <ConditionPhotosField
      title="Condition after service"
      description="How the vehicle looked when the work was done"
      icon={IconPhotoCheck}
      saved={job?.conditionAfter}
      value={photos.conditionAfter}
      onChange={(files) => onPhotosChange("conditionAfter", files)}
    />
  ) : (
    <ConditionPhotosField
      title="Condition before service"
      description="How the vehicle looked when it came in"
      icon={IconCamera}
      saved={job?.conditionBefore}
      value={photos.conditionBefore}
      onChange={(files) => onPhotosChange("conditionBefore", files)}
    />
  );

/** Right column: the checks performed and what it all cost. */
export const MaintenanceAsideFields = ({ form }) => {
  const { checklist } = form.values;

  return (
    <>
      <FormSection
        title="Inspection checklist"
        description="What was checked and how it looked"
        icon={IconChecklist}
        action={
          <Badge size="lg" color="gray">
            {checklist.length} {checklist.length === 1 ? "check" : "checks"}
          </Badge>
        }
        plain
      >
        <Stack gap="sm">
          {checklist.map((row, index) => (
            <RepeaterRow
              key={index}
              index={index}
              canRemove={checklist.length > 1}
              onRemove={() => form.removeListItem("checklist", index)}
            >
              <Grid align="flex-start" gutter="xs">
                {["item", "condition"].map((field) => (
                  <Grid.Col key={field} span={HALF}>
                    <PicklistsSelect
                      queryObject={{
                        resource: "Maintenance",
                        field: `checklist.${field}`,
                      }}
                      selectProps={{
                        label: field[0].toUpperCase() + field.slice(1),
                        placeholder: `Select ${field}`,
                        ...form.getInputProps(`checklist.${index}.${field}`),
                      }}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </RepeaterRow>
          ))}

          <Button
            variant="light"
            size="xs"
            leftSection={<IconPlus size={16} />}
            onClick={() =>
              form.insertListItem("checklist", { ...EMPTY_CHECKLIST_ITEM })
            }
          >
            Add check
          </Button>
        </Stack>
      </FormSection>

      <FormSection title="Total cost" icon={IconTool} plain>
        <CurrencyInput
          label="Total cost"
          placeholder="150,500"
          description="Everything the job cost"
          {...form.getInputProps("cost")}
        />
      </FormSection>
    </>
  );
};
