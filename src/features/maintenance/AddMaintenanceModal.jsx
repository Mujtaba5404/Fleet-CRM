import { ActionIcon, Badge, Button, Fieldset, Grid, Group, Modal, NumberInput, Paper, ScrollArea, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useCreateMaintenanceMutation } from "../../api/maintenance";
import formatAmount from "../../utils/formatAmount";
import PicklistsSelect from "../picklists/components/PicklistsSelect";

const QUARTER = { base: 12, sm: 6, lg: 3 };
const HALF = { base: 12, sm: 6 };
const FULL = 12;

const EMPTY_COMPONENT = { component: null, quantity: 1, unitCost: "", totalCost: 0 };
const EMPTY_CHECKLIST_ITEM = { item: null, status: null, condition: null };

const INITIAL_VALUES = {
  company: "",
  fleet: "",
  type: null,
  status: null,
  priority: null,
  reportedBy: "",
  assignedTo: "",
  assignedOn: null,
  provider: null,
  startedDate: null,
  endDate: null,
  odometer: "",
  cost: "",
  components: [{ ...EMPTY_COMPONENT }],
  checklist: [{ ...EMPTY_CHECKLIST_ITEM }],
  notes: "",
};

const MODAL_STYLES = {
  content: { display: "flex", flexDirection: "column" },
  body: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: 0 },
};

const RowCard = ({ title, onRemove, canRemove, children }) => (
  <Paper p="sm" withBorder radius="md">
    <Group justify="space-between" mb="xs">
      <Text size="xs" c="dimmed" fw={500}>
        {title}
      </Text>

      {canRemove && (
        <ActionIcon variant="subtle" color="red" onClick={onRemove}>
          <IconTrash size={16} />
        </ActionIcon>
      )}
    </Group>

    {children}
  </Paper>
);

const AddMaintenanceModal = ({ isOpen = false, onClose = () => {} }) => {
  const createMaintenanceMutation = useCreateMaintenanceMutation();
  const navigate = useNavigate();

  const form = useForm({ initialValues: INITIAL_VALUES });

  const { components, checklist } = form.values;

  const componentsTotal = components.reduce((sum, row) => sum + (Number(row.totalCost) || 0), 0);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (values) => {
    createMaintenanceMutation.mutate(values, {
      onSuccess: ({ data }) => {
        form.reset();
        onClose();
        navigate(`/maintenance/${data._id}`);
      },
    });
  };

  const setComponentField = (index, key, value) => {
    form.setFieldValue(`components.${index}.${key}`, value);

    const row = { ...components[index], [key]: value };
    form.setFieldValue(`components.${index}.totalCost`, (Number(row.quantity) || 0) * (Number(row.unitCost) || 0));
  };

  const picklist = (path, label, { span = QUARTER, field, ...props } = {}) => (
    <Grid.Col span={span}>
      <PicklistsSelect
        queryObject={{ resource: "Maintenance", field: field || path }}
        selectProps={{ label, placeholder: `Select ${label.toLowerCase()}`, ...props, ...form.getInputProps(path) }}
      />
    </Grid.Col>
  );

  const date = (path, label, { span = QUARTER, ...props } = {}) => (
    <Grid.Col span={span}>
      <DateInput clearable valueFormat="DD MMM YYYY" label={label} placeholder={`Pick ${label.toLowerCase()}`} {...props} {...form.getInputProps(path)} />
    </Grid.Col>
  );

  return (
    <Modal fullScreen radius={0} title="Create maintenance" opened={isOpen} onClose={handleClose} styles={MODAL_STYLES} transitionProps={{ transition: "fade", duration: 200 }}>
      <Stack component="form" onSubmit={form.onSubmit(handleSubmit)} gap={0} style={{ flex: 1, minHeight: 0 }}>
        <ScrollArea scrollbars="y" offsetScrollbars style={{ flex: 1, minHeight: 0 }}>
          <Stack pb="md">
            <Fieldset legend="Job information" radius="md">
              <Grid align="flex-start">
                {/* fleet / company / users picklist nahi hain — apne Fleets aur Users select se replace karein */}
                <Grid.Col span={HALF}>
                  <TextInput required label="Fleet (vehicle ID)" placeholder="Fleet ObjectId" {...form.getInputProps("fleet")} />
                </Grid.Col>

                <Grid.Col span={HALF}>
                  <TextInput required label="Company ID" placeholder="Company ObjectId" {...form.getInputProps("company")} />
                </Grid.Col>

                {picklist("type", "Type", { required: true })}
                {picklist("status", "Status", { required: true })}
                {picklist("priority", "Priority", { required: true })}
                {picklist("provider", "Provider")}

                <Grid.Col span={HALF}>
                  <NumberInput required label="Odometer at service" placeholder="3,000" min={0} thousandSeparator="," hideControls {...form.getInputProps("odometer")} />
                </Grid.Col>

                <Grid.Col span={HALF}>
                  <NumberInput
                    label="Total cost"
                    placeholder="150,500"
                    min={0}
                    thousandSeparator=","
                    hideControls
                    description={componentsTotal ? `Parts add up to ${formatAmount(componentsTotal)}` : ""}
                    {...form.getInputProps("cost")}
                  />
                </Grid.Col>
              </Grid>
            </Fieldset>

            <Fieldset legend="People & schedule" radius="md">
              <Grid align="flex-start">
                <Grid.Col span={QUARTER}>
                  <TextInput label="Reported by (User ID)" placeholder="User ObjectId" {...form.getInputProps("reportedBy")} />
                </Grid.Col>

                <Grid.Col span={QUARTER}>
                  <TextInput label="Assigned to (User ID)" placeholder="User ObjectId" {...form.getInputProps("assignedTo")} />
                </Grid.Col>

                {date("assignedOn", "Assigned on")}
                {date("startedDate", "Started")}
                {date("endDate", "Completed", { minDate: form.values.startedDate || undefined })}
              </Grid>
            </Fieldset>

            <Fieldset legend="Parts & components" radius="md">
              <Stack gap="sm">
                {components.map((row, index) => (
                  <RowCard key={index} title={`Part ${index + 1}`} canRemove={components.length > 1} onRemove={() => form.removeListItem("components", index)}>
                    <Grid align="flex-start">
                      <Grid.Col span={{ base: 12, sm: 6, lg: 6 }}>
                        <PicklistsSelect
                          queryObject={{ resource: "Maintenance", field: "components.component" }}
                          selectProps={{ label: "Component", placeholder: "Select component", ...form.getInputProps(`components.${index}.component`) }}
                        />
                      </Grid.Col>

                      <Grid.Col span={{ base: 4, sm: 2 }}>
                        <NumberInput label="Quantity" placeholder="1" min={1} hideControls value={row.quantity} onChange={(value) => setComponentField(index, "quantity", value)} />
                      </Grid.Col>

                      <Grid.Col span={{ base: 4, sm: 2 }}>
                        <NumberInput
                          label="Unit cost"
                          placeholder="100"
                          min={0}
                          thousandSeparator=","
                          hideControls
                          value={row.unitCost}
                          onChange={(value) => setComponentField(index, "unitCost", value)}
                        />
                      </Grid.Col>

                      <Grid.Col span={{ base: 4, sm: 2 }}>
                        <NumberInput label="Line total" readOnly variant="filled" thousandSeparator="," hideControls value={row.totalCost} />
                      </Grid.Col>
                    </Grid>
                  </RowCard>
                ))}

                <Group justify="space-between">
                  <Button variant="light" size="xs" leftSection={<IconPlus size={16} />} onClick={() => form.insertListItem("components", { ...EMPTY_COMPONENT })}>
                    Add component
                  </Button>

                  <Badge variant="light" size="md">
                    {formatAmount(componentsTotal)}
                  </Badge>
                </Group>
              </Stack>
            </Fieldset>

            <Fieldset legend="Inspection checklist" radius="md">
              <Stack gap="sm">
                {checklist.map((row, index) => (
                  <RowCard key={index} title={`Check ${index + 1}`} canRemove={checklist.length > 1} onRemove={() => form.removeListItem("checklist", index)}>
                    <Grid align="flex-start">
                      <Grid.Col span={{ base: 12, sm: 4 }}>
                        <PicklistsSelect
                          queryObject={{ resource: "Maintenance", field: "checklist.item" }}
                          selectProps={{ label: "Item", placeholder: "Select item", ...form.getInputProps(`checklist.${index}.item`) }}
                        />
                      </Grid.Col>

                      <Grid.Col span={{ base: 12, sm: 4 }}>
                        <PicklistsSelect
                          queryObject={{ resource: "Maintenance", field: "checklist.status" }}
                          selectProps={{ label: "Status", placeholder: "Select status", ...form.getInputProps(`checklist.${index}.status`) }}
                        />
                      </Grid.Col>

                      <Grid.Col span={{ base: 12, sm: 4 }}>
                        <PicklistsSelect
                          queryObject={{ resource: "Maintenance", field: "checklist.condition" }}
                          selectProps={{ label: "Condition", placeholder: "Select condition", ...form.getInputProps(`checklist.${index}.condition`) }}
                        />
                      </Grid.Col>
                    </Grid>
                  </RowCard>
                ))}
                  <Button variant="light" size="xs" leftSection={<IconPlus size={16} />} onClick={() => form.insertListItem("checklist", { ...EMPTY_CHECKLIST_ITEM })}>
                    Add checklist row
                  </Button>
              </Stack>
            </Fieldset>

            <Textarea label="Notes" placeholder="Anything the mechanic or next inspector should know" autosize minRows={3} maxRows={6} {...form.getInputProps("notes")} />
          </Stack>
        </ScrollArea>

        <Group justify="flex-end" py="md" bg="var(--mantine-color-body)">
          <Button variant="light" color="red" onClick={handleClose}>
            Cancel
          </Button>

          <Button type="submit" loading={createMaintenanceMutation.isPending}>
            Create maintenance
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AddMaintenanceModal;