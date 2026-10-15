import {
  Grid,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  IconCalculator,
  IconCash,
  IconTrendingDown,
} from "@tabler/icons-react";
import CurrencyInput from "../../components/CurrencyInput";
import FormSection from "../../components/FormSection";
import formatAmount from "../../utils/formatAmount";
import formatDate from "../../utils/formatDate";
import FleetsSelect from "../fleets/FleetsSelect";
import {
  DEPRECIATION_METHOD_OPTIONS,
  DEPRECIATION_METHODS,
} from "./depreciationForm";
import {
  buildMonthlySchedule,
  depreciationEndDate,
} from "./depreciationSchedule";

const HALF = { base: 12, sm: 6 };

/**
 * Left column: which vehicle, how, and over how long. `onFleetChange` lets the
 * add form fill in what it can from the picked vehicle. `fleetLocked` keeps
 * the vehicle fixed when the form is opened from that vehicle's screen.
 */
export const DepreciationMainFields = ({
  form,
  onFleetChange,
  fleetLocked = false,
}) => {
  const fleetInput = form.getInputProps("fleet");
  const isDeclining =
    form.values.method === DEPRECIATION_METHODS.DECLINING_BALANCE;

  return (
    <FormSection
      title="Schedule"
      description="Which vehicle is depreciated, how, and from when"
      icon={IconTrendingDown}
    >
      <Grid.Col span={12}>
        <FleetsSelect
          selectProps={{
            withAsterisk: true,
            label: "Vehicle",
            placeholder: "Search by plate, make or model",
            ...fleetInput,
            onChange: (value) => {
              fleetInput.onChange(value);
              onFleetChange?.(value);
            },
            disabled: fleetLocked,
          }}
        />
      </Grid.Col>

      <Grid.Col span={12}>
        <Select
          withAsterisk
          label="Method"
          allowDeselect={false}
          searchable={false}
          data={DEPRECIATION_METHOD_OPTIONS}
          renderOption={({ option }) => (
            <Stack gap={0}>
              <Text fz="sm">{option.label}</Text>
              <Text fz="xs" c="dimmed">
                {option.description}
              </Text>
            </Stack>
          )}
          {...form.getInputProps("method")}
        />
      </Grid.Col>

      <Grid.Col span={HALF}>
        <DateInput
          withAsterisk
          clearable
          valueFormat="DD MMM YYYY"
          label="Start date"
          placeholder="Pick start date"
          {...form.getInputProps("startDate")}
        />
      </Grid.Col>

      <Grid.Col span={HALF}>
        <NumberInput
          withAsterisk
          label="Useful life"
          placeholder="24"
          min={1}
          allowDecimal={false}
          suffix=" months"
          hideControls
          {...form.getInputProps("usefulLifeMonths")}
        />
      </Grid.Col>

      <Grid.Col span={12}>
        <NumberInput
          withAsterisk={isDeclining}
          label="Depreciation rate"
          description={
            isDeclining
              ? "Yearly rate, taken off what is left each month"
              : "Optional for straight line"
          }
          placeholder="20"
          min={0}
          max={100}
          suffix=" %"
          hideControls
          {...form.getInputProps("depreciationRate")}
        />
      </Grid.Col>
    </FormSection>
  );
};

const PreviewFigure = ({ label, value }) => (
  <Stack gap={2}>
    <Text fz="xs" c="dimmed">
      {label}
    </Text>
    <Text fz="sm" fw={600} className="numeric">
      {value}
    </Text>
  </Stack>
);

/** What the values above work out to, before anything is saved. */
const SchedulePreview = ({ values }) => {
  const monthly = buildMonthlySchedule(values);

  if (!monthly.length || !Number(values.acquisitionCost))
    return (
      <Text fz="sm" c="dimmed">
        Fill in the cost and useful life to see how the value falls.
      </Text>
    );

  const end = depreciationEndDate(values);
  const firstYear = monthly
    .slice(0, 12)
    .reduce((total, row) => total + row.depreciation, 0);

  return (
    <SimpleGrid cols={2} spacing="md" verticalSpacing="md">
      <PreviewFigure
        label="First month"
        value={formatAmount(monthly[0].depreciation)}
      />
      <PreviewFigure label="First year" value={formatAmount(firstYear)} />
      <PreviewFigure
        label="Value at the end"
        value={formatAmount(monthly.at(-1).closing)}
      />
      <PreviewFigure label="Ends on" value={end ? formatDate(end) : "—"} />
    </SimpleGrid>
  );
};

/** Right column: the money, and a preview of the schedule it produces. */
export const DepreciationAsideFields = ({ form }) => (
  <>
    <FormSection
      title="Values"
      description="What the vehicle cost and what it is worth at the end of its life"
      icon={IconCash}
    >
      <Grid.Col span={HALF}>
        <CurrencyInput
          withAsterisk
          label="Acquisition cost"
          placeholder="150,000"
          {...form.getInputProps("acquisitionCost")}
        />
      </Grid.Col>

      <Grid.Col span={HALF}>
        <CurrencyInput
          withAsterisk
          label="Salvage value"
          placeholder="20,000"
          {...form.getInputProps("salvageValue")}
        />
      </Grid.Col>
    </FormSection>

    <FormSection
      title="Preview"
      description="An estimate from the values above"
      icon={IconCalculator}
      plain
    >
      <SchedulePreview values={form.values} />
    </FormSection>
  </>
);
