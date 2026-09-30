import { Grid, NumberInput, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCar, IconCash, IconUserCheck } from "@tabler/icons-react";
import FormSection from "../../components/FormSection";
import ReferenceInput from "../../components/ReferenceInput";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };
const THIRD = { base: 12, sm: 4 };

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

  return (
    <FormSection
      title="Vehicle"
      description="What this vehicle is and how it is identified"
      icon={IconCar}
    >
      {picklist("make", "Make", { span: 12, withAsterisk: true })}
      {picklist("model", "Model", {
        span: 12,
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
          tt="uppercase"
          {...form.getInputProps("licensePlate")}
        />
      </Grid.Col>

      <Grid.Col span={HALF}>
        <NumberInput
          label="Year"
          placeholder={`${new Date().getFullYear()}`}
          hideControls
          {...form.getInputProps("year")}
        />
      </Grid.Col>

      {picklist("type", "Type")}

      <Grid.Col span={HALF}>
        <TextInput
          label="Colour"
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
          <NumberInput
            withAsterisk
            label="Purchase amount"
            placeholder="5,500,000"
            min={0}
            thousandSeparator=","
            hideControls
            {...form.getInputProps("purchaseAmount")}
          />
        </Grid.Col>

        {date("purchaseDate", "Purchase date", {
          span: THIRD,
          withAsterisk: true,
          maxDate: new Date(),
        })}

        <Grid.Col span={THIRD}>
          <NumberInput
            label="Monthly rent"
            placeholder="15,000"
            min={0}
            thousandSeparator=","
            hideControls
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
          <ReferenceInput label="Company" {...form.getInputProps("company")} />
        </Grid.Col>

        <Grid.Col span={THIRD}>
          <ReferenceInput
            label="Assigned to"
            {...form.getInputProps("assignedTo")}
          />
        </Grid.Col>

        <Grid.Col span={THIRD}>
          <ReferenceInput
            label="Inspector"
            {...form.getInputProps("inspector")}
          />
        </Grid.Col>

        {date("assignedOn", "Assigned on", { span: 12 })}
      </FormSection>
    </>
  );
};
