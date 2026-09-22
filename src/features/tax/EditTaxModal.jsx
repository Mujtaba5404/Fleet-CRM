import { Button, Fieldset, Grid, Group, Modal, NumberInput, ScrollArea, Stack, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useUpdateInsuranceMutation } from "../../api/insurance";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const HALF = { base: 12, sm: 6 };
const THIRD = { base: 12, sm: 4 };

const MODAL_STYLES = {
  content: { display: "flex", flexDirection: "column" },
  body: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: 0 },
};

const toDate = (value) => (value ? new Date(value) : null);
const toId = (value) => value?._id ?? value ?? null;

const toFormValues = (insurance = {}) => ({
  company: toId(insurance.company) || "",
  fleet: toId(insurance.fleet) || "",
  policyNumber: insurance.policyNumber || "",
  provider: toId(insurance.provider),
  status: toId(insurance.status),
  startDate: toDate(insurance.startDate),
  endDate: toDate(insurance.endDate),
  cancellationDate: toDate(insurance.cancellationDate),
  cancellationReason: insurance.cancellationReason || "",
  premium: insurance.premium ?? insurance.totalPremium ?? "",
  coverage: insurance.coverage ?? "",
  notes: insurance.notes || "",
});

const EditTaxModal = ({ insurance, isOpen = false, onClose = () => {} }) => {
  const updateInsuranceMutation = useUpdateInsuranceMutation();

  const form = useForm({ initialValues: toFormValues(insurance) });

  // modal khulne par latest record se values bhar dein
  useEffect(() => {
    if (isOpen && insurance) form.setValues(toFormValues(insurance));
  }, [isOpen, insurance?._id, insurance?.updatedAt]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (values) => {
    updateInsuranceMutation.mutate({ insuranceId: insurance._id, payload: values }, { onSuccess: () => onClose() });
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
    <Modal fullScreen radius={0} title="Update insurance policy" opened={isOpen} onClose={handleClose} styles={MODAL_STYLES} transitionProps={{ transition: "fade", duration: 200 }}>
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

          <Button type="submit" loading={updateInsuranceMutation.isPending}>
            Save changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditTaxModal;