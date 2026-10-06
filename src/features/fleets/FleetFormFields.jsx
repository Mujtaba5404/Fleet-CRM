import { Grid, NumberInput, TextInput } from "@mantine/core";
import { DateInput, YearPickerInput } from "@mantine/dates";
import { IconCar, IconCash, IconUserCheck } from "@tabler/icons-react";
import CurrencyInput from "../../components/CurrencyInput";
import FormSection from "../../components/FormSection";
import CompaniesSelect from "../companies/CompaniesSelect";
import PicklistsSelect from "../picklists/components/PicklistsSelect";
import UsersSelect from "../users/UsersSelect";

const HALF = { base: 12, sm: 6 };
const THIRD = { base: 12, sm: 4 };
const CURRENT_YEAR = new Date().getFullYear();

/** Builders shared by both columns, so field wiring lives in one place. */
const useFleetFields = (form) => {
  const picklist = (path, label, { span = HALF, query, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Fleet", field: path, ...query }}
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

/** Left column: what the vehicle is. */
export const FleetMainFields = ({ form }) => {
  const { picklist } = useFleetFields(form);
  const { make } = form.values;

  // The form keeps the year as a number; the picker speaks "YYYY-01-01".
  const yearProps = form.getInputProps("year");

  return (
    <FormSection
      title="Vehicle"
      description="What this vehicle is and how it is identified"
      icon={IconCar}
    >
      {picklist("make", "Make", { withAsterisk: true })}
      {picklist("model", "Model", {
        withAsterisk: true,
        disabled: !make,
        query: { parentPicklist: make },
        placeholder: make ? "Select model" : "Select a make first",
      })}

      <Grid.Col span={HALF}>
        <TextInput
          withAsterisk
          label="License plate"
          placeholder="ABC1234"
          {...form.getInputProps("licensePlate")}
        />
      </Grid.Col>

      <Grid.Col span={HALF}>
        <YearPickerInput
          clearable
          label="Year"
          placeholder={`${CURRENT_YEAR}`}
          minDate="1900-01-01"
          maxDate={`${CURRENT_YEAR + 1}-12-31`}
          {...yearProps}
          value={yearProps.value ? `${yearProps.value}-01-01` : null}
          onChange={(value) =>
            yearProps.onChange(value ? Number(value.slice(0, 4)) : "")
          }
        />
      </Grid.Col>

      {picklist("type", "Type")}

      <Grid.Col span={HALF}>
        <TextInput
          label="Color"
          placeholder="White"
          {...form.getInputProps("color")}
        />
      </Grid.Col>

      {picklist("fuelType", "Fuel type", { withAsterisk: true })}
      {picklist("transmission", "Transmission", { withAsterisk: true })}
      {picklist("status", "Status", { withAsterisk: true })}
      {picklist("condition", "Condition", { withAsterisk: true })}
    </FormSection>
  );
};

/** Right column: what it cost and who holds it. */
export const FleetAsideFields = ({ form, showCurrentOdometer = false }) => {
  const { date } = useFleetFields(form);

  return (
    <>
      <FormSection
        title="Purchase & running costs"
        description="What it cost and how far it has run"
        icon={IconCash}
      >
        <Grid.Col span={THIRD}>
          <CurrencyInput
            withAsterisk
            label="Purchase amount"
            placeholder="5,500,000"
            {...form.getInputProps("purchaseAmount")}
          />
        </Grid.Col>

        {date("purchaseDate", "Purchase date", {
          span: THIRD,
          withAsterisk: true,
          maxDate: new Date(),
        })}

        <Grid.Col span={THIRD}>
          <CurrencyInput
            label="Monthly rent"
            placeholder="15,000"
            {...form.getInputProps("rent")}
          />
        </Grid.Col>

        <Grid.Col span={showCurrentOdometer ? HALF : 12}>
          <NumberInput
            label="Initial odometer"
            placeholder="2,000"
            min={0}
            thousandSeparator=","
            hideControls
            {...form.getInputProps("initialOdometer")}
          />
        </Grid.Col>

        {showCurrentOdometer && (
          <Grid.Col span={HALF}>
            <NumberInput
              label="Current odometer"
              placeholder="12,000"
              min={0}
              thousandSeparator=","
              hideControls
              {...form.getInputProps("currentOdometer")}
            />
          </Grid.Col>
        )}
      </FormSection>

      <FormSection
        title="Ownership & assignment"
        description="Who holds this vehicle today"
        icon={IconUserCheck}
      >
        <Grid.Col span={THIRD}>
          <CompaniesSelect
            selectProps={{
              label: "Company",
              placeholder: "Select company",
              ...form.getInputProps("company"),
            }}
          />
        </Grid.Col>

        <Grid.Col span={THIRD}>
          <UsersSelect
            selectProps={{
              label: "Assigned to",
              placeholder: "Select user",
              ...form.getInputProps("assignedTo"),
            }}
          />
        </Grid.Col>

        <Grid.Col span={THIRD}>
          <UsersSelect
            selectProps={{
              label: "Inspector",
              placeholder: "Select inspector",
              ...form.getInputProps("inspector"),
            }}
          />
        </Grid.Col>

        {date("assignedOn", "Assigned on", { span: 12 })}
      </FormSection>
    </>
  );
};
