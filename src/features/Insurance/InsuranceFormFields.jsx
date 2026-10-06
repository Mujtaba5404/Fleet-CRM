import { Grid, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconBan,
  IconCalendarEvent,
  IconCash,
  IconFileDescription,
  IconShieldCheck,
} from "@tabler/icons-react";
import CurrencyInput from "../../components/CurrencyInput";
import FormSection from "../../components/FormSection";
import FleetsSelect from "../fleets/FleetsSelect";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };
const THIRD = { base: 12, sm: 4 };

/** Field builders bound to a form instance. */
const useInsuranceFields = (form) => {
  const picklist = (path, label, { span = HALF, field, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Insurance", field: field || path }}
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

/** Left column: who is covered, by whom, and for how long. */
export const InsuranceMainFields = ({ form }) => {
  const { picklist, date } = useInsuranceFields(form);

  return (
    <>
      <FormSection
        title="Policy"
        description="Who is covered and by whom"
        icon={IconShieldCheck}
      >
        <Grid.Col span={12}>
          <TextInput
            withAsterisk
            label="Policy number"
            placeholder="POL-2026-0001"
            {...form.getInputProps("policyNumber")}
          />
        </Grid.Col>

        {picklist("status", "Status", { withAsterisk: true })}
        {picklist("provider", "Provider", { withAsterisk: true })}

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
        title="Cover period"
        description="When this policy runs"
        icon={IconCalendarEvent}
      >
        {date("startDate", "Start date", { withAsterisk: true })}
        {date("endDate", "End date", {
          withAsterisk: true,
          minDate: form.values.startDate || undefined,
        })}
      </FormSection>
    </>
  );
};

/** Right column: money, cancellation and notes. */
export const InsuranceAsideFields = ({ form }) => {
  const { date } = useInsuranceFields(form);

  return (
    <>
      <FormSection
        title="Amounts"
        description="What it costs and what it covers"
        icon={IconCash}
      >
        <Grid.Col span={HALF}>
          <CurrencyInput
            withAsterisk
            label="Premium"
            placeholder="12,000"
            {...form.getInputProps("premium")}
          />
        </Grid.Col>

        <Grid.Col span={HALF}>
          <CurrencyInput
            withAsterisk
            label="Coverage limit"
            placeholder="100,000"
            {...form.getInputProps("coverage")}
          />
        </Grid.Col>
      </FormSection>

      <FormSection
        title="Cancellation"
        description="Only if the policy was ended early"
        icon={IconBan}
      >
        {date("cancellationDate", "Cancelled on", { span: THIRD })}

        <Grid.Col span={{ base: 12, sm: 8 }}>
          <TextInput
            label="Cancellation reason"
            placeholder="Switched provider"
            {...form.getInputProps("cancellationReason")}
          />
        </Grid.Col>
      </FormSection>

      <FormSection title="Notes" icon={IconFileDescription} plain>
        <Textarea
          placeholder="Anything worth recording about this policy"
          autosize
          minRows={3}
          maxRows={10}
          {...form.getInputProps("notes")}
        />
      </FormSection>
    </>
  );
};
