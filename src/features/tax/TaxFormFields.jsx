import { Grid, NumberInput, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconCalendarEvent,
  IconCash,
  IconFileDescription,
  IconReceiptTax,
} from "@tabler/icons-react";
import FormSection from "../../components/FormSection";
import ReferenceInput from "../../components/ReferenceInput";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };

/** Field builders bound to a form instance. */
const useTaxFields = (form) => {
  const picklist = (path, label, { span = HALF, field, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Tax", field: field || path }}
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

/** Left column: the challan itself and the period it covers. */
export const TaxMainFields = ({ form }) => {
  const { picklist, date } = useTaxFields(form);

  return (
    <>
      <FormSection
        title="Challan"
        description="The filing and who it belongs to"
        icon={IconReceiptTax}
      >
        <Grid.Col span={12}>
          <TextInput
            withAsterisk
            label="Challan number"
            placeholder="ABCD1234"
            tt="uppercase"
            {...form.getInputProps("challanNumber")}
          />
        </Grid.Col>

        {picklist("status", "Status", { withAsterisk: true })}
        {picklist("jurisdiction", "Jurisdiction", { withAsterisk: true })}

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
      </FormSection>

      <FormSection
        title="Tax period"
        description="What period this challan covers"
        icon={IconCalendarEvent}
      >
        {date("startDate", "Period start", { withAsterisk: true })}
        {date("endDate", "Period end", {
          withAsterisk: true,
          minDate: form.values.startDate || undefined,
        })}
        {date("filingDate", "Filed on", { span: 12 })}
      </FormSection>
    </>
  );
};

/** Right column: amount and notes. */
export const TaxAsideFields = ({ form }) => (
  <>
    <FormSection
      title="Amount"
      description="What is owed on this challan"
      icon={IconCash}
    >
      <Grid.Col span={12}>
        <NumberInput
          withAsterisk
          label="Tax amount"
          placeholder="1,000"
          min={0}
          thousandSeparator=","
          hideControls
          {...form.getInputProps("taxAmount")}
        />
      </Grid.Col>
    </FormSection>

    <FormSection title="Notes" icon={IconFileDescription} plain>
      <Textarea
        placeholder="Anything worth recording about this filing"
        autosize
        minRows={5}
        maxRows={12}
        {...form.getInputProps("notes")}
      />
    </FormSection>
  </>
);
