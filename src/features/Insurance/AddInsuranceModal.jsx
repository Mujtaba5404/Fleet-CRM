import { Button, Fieldset, Grid, Group, Modal, NumberInput, ScrollArea, Stack, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useCreateInsuranceMutation } from "../../api/insurance";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };
const THIRD = { base: 12, sm: 4 };
const FULL = 12;

const INITIAL_VALUES = {
  company: "",
  fleet: "",
  policyNumber: "",
  provider: null,
  status: null,
  startDate: null,
  endDate: null,
  cancellationDate: null,
  cancellationReason: "",
  premium: "",
  coverage: "",
  notes: "",
};

const MODAL_STYLES = {
  content: { display: "flex", flexDirection: "column" },
  body: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: 0 },
};

const AddInsuranceModal = ({ isOpen = false, onClose = () => {} }) => {
  const createInsuranceMutation = useCreateInsuranceMutation();
  const navigate = useNavigate();

  const form = useForm({ initialValues: INITIAL_VALUES });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createInsuranceMutation.mutate(values, {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        navigate(`/insurance/${data._id}`);
      },
    });
  };

  const picklist = (path, label, { span = HALF, field, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Insurance", field: field || path }}
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
    <Modal fullScreen radius={0} title="Create insurance policy" opened={isOpen} onClose={handleClose} styles={MODAL_STYLES} transitionProps={{ transition: "fade", duration: 200 }}>
      <Stack component="form" onSubmit={form.onSubmit(handleSubmit)} gap={0} style={{ flex: 1, minHeight: 0 }}>
        <ScrollArea scrollbars="y" offsetScrollbars style={{ flex: 1, minHeight: 0 }}>
          <Stack pb="md">
            <Fieldset legend="Policy information" radius="md">
              <Grid align="flex-start">
                <Grid.Col span={HALF}>
                  <TextInput required label="Policy number" placeholder="POL-2026-0001" tt="uppercase" {...form.getInputProps("policyNumber")} />
                </Grid.Col>

                {picklist("status", "Status", { required: true })}
                {picklist("provider", "Provider", { required: true })}

                {/* fleet / company picklist nahi hain — apne Fleets aur Companies select se replace karein */}
                <Grid.Col span={HALF}>
                  <TextInput required label="Fleet (vehicle ID)" placeholder="Fleet ObjectId" {...form.getInputProps("fleet")} />
                </Grid.Col>

                <Grid.Col span={HALF}>
                  <TextInput required label="Company ID" placeholder="Company ObjectId" {...form.getInputProps("company")} />
                </Grid.Col>
              </Grid>
            </Fieldset>

            <Fieldset legend="Cover period" radius="md">
              <Grid align="flex-start">
                {date("startDate", "Start date", { span: HALF, required: true })}
                {date("endDate", "End date", { span: HALF, required: true, minDate: form.values.startDate || undefined })}
              </Grid>
            </Fieldset>

            <Fieldset legend="Amounts" radius="md">
              <Grid align="flex-start">
                <Grid.Col span={HALF}>
                  <NumberInput required label="Premium" placeholder="12,000" min={0} thousandSeparator="," hideControls {...form.getInputProps("premium")} />
                </Grid.Col>

                <Grid.Col span={HALF}>
                  <NumberInput required label="Coverage limit" placeholder="100,000" min={0} thousandSeparator="," hideControls {...form.getInputProps("coverage")} />
                </Grid.Col>
              </Grid>
            </Fieldset>

            <Fieldset legend="Cancellation" radius="md">
              <Grid align="flex-start">
                {date("cancellationDate", "Cancelled on", { span: THIRD })}

                <Grid.Col span={{ base: 12, sm: 8 }}>
                  <TextInput label="Cancellation reason" placeholder="Bad service" {...form.getInputProps("cancellationReason")} />
                </Grid.Col>
              </Grid>
            </Fieldset>

            <Textarea label="Notes" placeholder="Comprehensive fleet insurance policy" autosize minRows={3} maxRows={6} {...form.getInputProps("notes")} />
          </Stack>
        </ScrollArea>

        <Group justify="flex-end" py="md" bg="var(--mantine-color-body)">
          <Button variant="light" color="red" onClick={handleClose}>
            Cancel
          </Button>

          <Button type="submit" loading={createInsuranceMutation.isPending}>
            Create policy
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AddInsuranceModal;