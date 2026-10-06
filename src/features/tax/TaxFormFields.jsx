import { Grid, Textarea, TextInput } from "@mantine/core";
import { DateInput, YearPickerInput } from "@mantine/dates";
import {
  IconCalendarEvent,
  IconCash,
  IconFileDescription,
  IconReceiptTax,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import CurrencyInput from "../../components/CurrencyInput";
import FormSection from "../../components/FormSection";
import FleetsSelect from "../fleets/FleetsSelect";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };

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

  // Tax is paid yearly, so the period is picked by year. The end of the
  // period is stored as 31 Dec of the picked year.
  const year = (path, label, { span = HALF, endOfYear = false, ...props } = {}) => {
    const input = form.getInputProps(path);

    return (
      <Grid.Col span={span}>
        <YearPickerInput
          clearable
          valueFormat="YYYY"
          label={label}
          placeholder="Pick year"
          {...props}
          {...input}
          onChange={(value) =>
            input.onChange(
              value && endOfYear
                ? dayjs(value).endOf("year").format("YYYY-MM-DD")
                : value,
            )
          }
        />
      </Grid.Col>
    );
  };

  return { picklist, date, year };
};


export const TaxMainFields = ({ form }) => {
  const { picklist, date, year } = useTaxFields(form);

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
            {...form.getInputProps("challanNumber")}
          />
        </Grid.Col>

        {picklist("status", "Status")}
        {picklist("jurisdiction", "Jurisdiction")}

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
      </FormSection>

      <FormSection
        title="Tax period"
        description="What period this challan covers"
        icon={IconCalendarEvent}
      >
        {year("startDate", "Period start", { withAsterisk: true })}
        {year("endDate", "Period end", {
          withAsterisk: true,
          endOfYear: true,
          minDate: form.values.startDate || undefined,
        })}
        {date("filingDate", "Filed on", { span: 12 })}
      </FormSection>
    </>
  );
};


export const TaxAsideFields = ({ form }) => (
  <>
    <FormSection
      title="Amount"
      description="What is owed on this challan"
      icon={IconCash}
    >
      <Grid.Col span={12}>
        <CurrencyInput
          withAsterisk
          label="Tax amount"
          placeholder="1,000"
          {...form.getInputProps("taxAmount")}
        />
      </Grid.Col>
    </FormSection>

    <FormSection title="Notes" icon={IconFileDescription} plain>
      <Textarea
        placeholder="Anything worth recording about this filing"
        autosize
        minRows={3}
        maxRows={12}
        {...form.getInputProps("notes")}
      />
    </FormSection>
  </>
);
