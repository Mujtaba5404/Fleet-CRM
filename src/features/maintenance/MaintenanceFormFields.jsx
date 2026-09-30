import {
  Badge,
  Button,
  Grid,
  NumberInput,
  Stack,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconChecklist,
  IconClipboardText,
  IconFileDescription,
  IconPlus,
  IconTool,
  IconUserCheck,
} from "@tabler/icons-react";
import FormSection from "../../components/FormSection";
import ReferenceInput from "../../components/ReferenceInput";
import RepeaterRow from "../../components/RepeaterRow";
import formatAmount from "../../utils/formatAmount";
import PicklistsSelect from "../picklists/components/PicklistsSelect";
import { EMPTY_CHECKLIST_ITEM, EMPTY_COMPONENT } from "./maintenanceForm";

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

/** Left column: what the job is, who is on it and when. */
export const MaintenanceMainFields = ({ form }) => {
  const { picklist, date } = useMaintenanceFields(form);

  return (
    <>
      <FormSection
        title="Job"
        description="What is being serviced and how urgent it is"
        icon={IconClipboardText}
      >
        <Grid.Col span={12}>
          <ReferenceInput
            withAsterisk
            label="Vehicle"
            {...form.getInputProps("fleet")}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <ReferenceInput
            withAsterisk
            label="Company"
            {...form.getInputProps("company")}
          />
        </Grid.Col>

        {picklist("type", "Type", { withAsterisk: true })}
        {picklist("status", "Status", { withAsterisk: true })}
        {picklist("priority", "Priority", { withAsterisk: true })}
        {picklist("provider", "Provider")}

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
        title="People & schedule"
        description="Who is handling it and when"
        icon={IconUserCheck}
      >
        <Grid.Col span={HALF}>
          <ReferenceInput
            label="Reported by"
            {...form.getInputProps("reportedBy")}
          />
        </Grid.Col>

        <Grid.Col span={HALF}>
          <ReferenceInput
            label="Assigned to"
            {...form.getInputProps("assignedTo")}
          />
        </Grid.Col>

        {date("assignedOn", "Assigned on")}
        {date("startedDate", "Started")}
        {date("endDate", "Completed", {
          span: 12,
          minDate: form.values.startedDate || undefined,
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

/** Right column: the line items — parts used and checks performed. */
export const MaintenanceAsideFields = ({ form }) => {
  const { components, checklist } = form.values;

  const componentsTotal = components.reduce(
    (sum, row) => sum + (Number(row.totalCost) || 0),
    0,
  );

  // Quantity and unit cost drive the line total, so recompute on either edit.
  const setComponentField = (index, key, value) => {
    form.setFieldValue(`components.${index}.${key}`, value);

    const row = { ...components[index], [key]: value };

    form.setFieldValue(
      `components.${index}.totalCost`,
      (Number(row.quantity) || 0) * (Number(row.unitCost) || 0),
    );
  };

  return (
    <>
      <FormSection
        title="Parts & components"
        description="Itemised parts used on this job"
        icon={IconTool}
        action={
          <Badge size="lg" className="numeric">
            {formatAmount(componentsTotal)}
          </Badge>
        }
        plain
      >
        <Stack gap="sm">
          {components.map((row, index) => (
            <RepeaterRow
              key={index}
              index={index}
              canRemove={components.length > 1}
              onRemove={() => form.removeListItem("components", index)}
            >
              <Grid align="flex-start" gutter="xs">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <PicklistsSelect
                    queryObject={{
                      resource: "Maintenance",
                      field: "components.component",
                    }}
                    selectProps={{
                      label: "Component",
                      placeholder: "Select component",
                      ...form.getInputProps(`components.${index}.component`),
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 4, sm: 2 }}>
                  <NumberInput
                    label="Qty"
                    placeholder="1"
                    min={1}
                    hideControls
                    value={row.quantity}
                    onChange={(value) =>
                      setComponentField(index, "quantity", value)
                    }
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 4, sm: 2 }}>
                  <NumberInput
                    label="Unit cost"
                    placeholder="100"
                    min={0}
                    thousandSeparator=","
                    hideControls
                    value={row.unitCost}
                    onChange={(value) =>
                      setComponentField(index, "unitCost", value)
                    }
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 4, sm: 2 }}>
                  <NumberInput
                    label="Line total"
                    readOnly
                    variant="filled"
                    thousandSeparator=","
                    hideControls
                    value={row.totalCost}
                  />
                </Grid.Col>
              </Grid>
            </RepeaterRow>
          ))}

          <Button
            variant="light"
            size="xs"
            leftSection={<IconPlus size={16} />}
            onClick={() =>
              form.insertListItem("components", { ...EMPTY_COMPONENT })
            }
          >
            Add part
          </Button>
        </Stack>
      </FormSection>

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
                {["item", "status", "condition"].map((field) => (
                  <Grid.Col key={field} span={{ base: 12, sm: 4 }}>
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
        <NumberInput
          label="Total cost"
          placeholder="150,500"
          min={0}
          thousandSeparator=","
          hideControls
          description={
            componentsTotal
              ? `Parts add up to ${formatAmount(componentsTotal)}`
              : "Parts plus labour"
          }
          {...form.getInputProps("cost")}
        />
      </FormSection>
    </>
  );
};
