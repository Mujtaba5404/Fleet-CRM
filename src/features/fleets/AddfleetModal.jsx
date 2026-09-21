import { Button, Drawer, Fieldset, Grid, NumberInput, ScrollArea, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreatefleetMutation } from "../../api/fleet";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };
const THIRD = { base: 12, sm: 4 };
const FULL = 12;

const INITIAL_VALUES = {
  make: null,
  model: null,
  year: "",
  type: null,
  fuelType: null,
  transmission: null,
  color: "",
  licensePlate: "",
  purchaseAmount: "",
  purchaseDate: null,
  rent: "",
  initialOdometer: "",
  status: null,
  condition: null,
  company: null,
  assignedTo: null,
  assignedOn: null,
  inspector: null,
};

const DRAWER_STYLES = {
  content: { display: "flex", flexDirection: "column" },
  body: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 },
};

const AddfleetModal = ({ isOpen = false, onClose = () => {} }) => {
  const createfleetMutation = useCreatefleetMutation();
  const navigate = useNavigate();

  const form = useForm({ initialValues: INITIAL_VALUES });

  form.watch("make", ({ value, previousValue }) => {
    if (value !== previousValue) form.setFieldValue("model", null);
  });

  const { make } = form.values;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createfleetMutation.mutate(values, {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        navigate(`/fleets/${data._id}`);
      },
    });
  };

  const picklist = (path, label, { span = HALF, query, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Fleet", field: path, ...query }}
        selectProps={{ label, placeholder: `Select ${label.toLowerCase()}`, ...props, ...form.getInputProps(path) }}
      />
    </Grid.Col>
  );

  const date = (path, label, { span = HALF, ...props } = {}) => (
    <Grid.Col span={span}>
      <DateInput clearable valueFormat="DD MMM YYYY" label={label} placeholder={`Pick ${label.toLowerCase()}`} {...props} {...form.getInputProps(path)} />
    </Grid.Col>
  );

  return (
    <Drawer size="lg" position="right" offset={8} radius="md" title="Add fleet" opened={isOpen} onClose={handleClose} styles={DRAWER_STYLES}>
      <Stack component="form" onSubmit={form.onSubmit(handleSubmit)} style={{ flex: 1, minHeight: 0 }}>
        <ScrollArea scrollbars="y" offsetScrollbars style={{ flex: 1, minHeight: 0 }}>
          <Stack>
            <Fieldset legend="Vehicle" variant="filled" radius="md">
              <Grid align="flex-start">
                {picklist("make", "Make", { required: true })}
                {picklist("model", "Model", {
                  required: true,
                  disabled: !make,
                  query: { parentPicklist: make },
                  placeholder: make ? "Select model" : "Select a make first",
                })}

                <Grid.Col span={HALF}>
                  <NumberInput label="Year" placeholder="2026" hideControls {...form.getInputProps("year")} />
                </Grid.Col>

                <Grid.Col span={HALF}>
                  <TextInput required label="License plate" placeholder="ABC1234" tt="uppercase" {...form.getInputProps("licensePlate")} />
                </Grid.Col>

                {picklist("type", "Type", { required: true })}

                <Grid.Col span={HALF}>
                  <TextInput label="Color" placeholder="red" {...form.getInputProps("color")} />
                </Grid.Col>

                {picklist("fuelType", "Fuel type", { required: true })}
                {picklist("transmission", "Transmission", { required: true })}
                {picklist("status", "Status", { required: true })}
                {picklist("condition", "Condition", { required: true })}
              </Grid>
            </Fieldset>

            <Fieldset legend="Purchase & rent" variant="filled" radius="md">
              <Grid align="flex-start">
                <Grid.Col span={THIRD}>
                  <NumberInput required label="Purchase amount" placeholder="5,500,000" min={0} thousandSeparator="," hideControls {...form.getInputProps("purchaseAmount")} />
                </Grid.Col>

                {date("purchaseDate", "Purchase date", { span: THIRD, required: true })}

                <Grid.Col span={THIRD}>
                  <NumberInput label="Monthly rent" placeholder="15,000" min={0} thousandSeparator="," hideControls {...form.getInputProps("rent")} />
                </Grid.Col>

                <Grid.Col span={12}>
                  <NumberInput label="Initial odometer" placeholder="2,000" min={0} thousandSeparator="," hideControls {...form.getInputProps("initialOdometer")} />
                </Grid.Col>
              </Grid>
            </Fieldset>

            <Fieldset legend="Assignment" variant="filled" radius="md">
              <Grid align="flex-start">
                {/* company / assignedTo / inspector picklist nahi hain — apne Companies aur Users select se replace karein */}
                <Grid.Col span={THIRD}>
                  <TextInput label="Company ID" placeholder="Company ObjectId" {...form.getInputProps("company")} />
                </Grid.Col>

                <Grid.Col span={THIRD}>
                  <TextInput label="Assigned to (User ID)" placeholder="User ObjectId" {...form.getInputProps("assignedTo")} />
                </Grid.Col>

                <Grid.Col span={THIRD}>
                  <TextInput label="Inspector (User ID)" placeholder="User ObjectId" {...form.getInputProps("inspector")} />
                </Grid.Col>

                {date("assignedOn", "Assigned on", { span: FULL })}
              </Grid>
            </Fieldset>
          </Stack>
        </ScrollArea>

        <Button type="submit" loading={createfleetMutation.isPending}>
          Add fleet
        </Button>
      </Stack>
    </Drawer>
  );
};

export default AddfleetModal;