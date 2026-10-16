import {
  Anchor,
  Grid,
  Group,
  Image,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { DateInput, YearPickerInput } from "@mantine/dates";
import {
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  PDF_MIME_TYPE,
} from "@mantine/dropzone";
import {
  IconBuilding,
  IconCar,
  IconCash,
  IconFileText,
  IconFileUpload,
  IconLicense,
  IconPaperclip,
  IconSteeringWheel,
} from "@tabler/icons-react";
import CurrencyInput from "../../components/CurrencyInput";
import FormSection from "../../components/FormSection";
import toFileUrl from "../../utils/toFileUrl";
import AttachmentsUpload from "../attachments/AttachmentsUpload";
import CompaniesSelect from "../companies/CompaniesSelect";
import PicklistsSelect from "../picklists/components/PicklistsSelect";
import UsersSelect from "../users/UsersSelect";
import { fileName } from "./fleetFileUtils";
import {
  FLEET_STATUS_OPTIONS,
  getFleetStatusOption,
  isAssignedStatus,
} from "./fleetStatus";

const HALF = { base: 12, sm: 6 };
const THIRD = { base: 12, sm: 4 };
const CURRENT_YEAR = new Date().getFullYear();

const StatusIcon = ({ status }) => {
  const option = getFleetStatusOption(status);
  if (!option) return null;

  const Icon = option.icon;
  return (
    <Icon size={16} color={`var(--mantine-color-${option.color}-filled)`} />
  );
};

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
      {/* Status is an enum on the API, not a picklist. */}
      <Grid.Col span={HALF}>
        <Select
          withAsterisk
          label="Status"
          placeholder="Select status"
          searchable={false}
          data={FLEET_STATUS_OPTIONS.map(({ value, label }) => ({
            value,
            label,
          }))}
          leftSection={<StatusIcon status={form.values.status} />}
          renderOption={({ option }) => (
            <Group gap="xs" wrap="nowrap">
              <StatusIcon status={option.value} />
              <Text fz="sm">{option.label}</Text>
            </Group>
          )}
          {...form.getInputProps("status")}
        />
      </Grid.Col>

      {picklist("condition", "Condition", { withAsterisk: true })}
    </FormSection>
  );
};

const DOCUMENT_MIME_TYPES = [
  ...PDF_MIME_TYPE,
  ...MS_WORD_MIME_TYPE,
  ...MS_EXCEL_MIME_TYPE,
  ...IMAGE_MIME_TYPE,
];

/** Files the vehicle already has, shown above the pickers on edit. */
const SavedFiles = ({ images = [], documents = [] }) => {
  const savedImages = images.filter((image) => toFileUrl(image));
  const savedDocuments = documents.filter((document) => toFileUrl(document));

  if (!savedImages.length && !savedDocuments.length) return null;

  return (
    <Stack gap="xs">
      <Text fz="xs" c="dimmed">
        Already saved
      </Text>

      <Group gap="sm">
        {savedImages.map((image, index) => (
          <Anchor
            key={`image-${index}`}
            href={toFileUrl(image)}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={toFileUrl(image)}
              alt={fileName(image)}
              w={88}
              h={56}
              radius="sm"
              fit="cover"
            />
          </Anchor>
        ))}

        {savedDocuments.map((document, index) => (
          <Anchor
            key={`document-${index}`}
            href={toFileUrl(document)}
            target="_blank"
            rel="noreferrer"
            fz="xs"
          >
            <Group gap={4} wrap="nowrap">
              <IconFileText size={16} />
              {fileName(document)}
            </Group>
          </Anchor>
        ))}
      </Group>
    </Stack>
  );
};

/**
 * Last section of the form: pictures of the vehicle and its paperwork, sent
 * as `images` and `documents`. `files` holds the newly picked ones; `saved`
 * is the record being edited, if any.
 */
export const FleetFilesFields = ({ files, onChange, saved }) => (
  <FormSection
    title="Images & documents"
    description="Pictures of the vehicle and its paperwork"
    icon={IconPaperclip}
    plain
  >
    <Stack gap="md">
      <SavedFiles images={saved?.images} documents={saved?.documents} />

      <Stack gap={6}>
        <Text fz="sm" fw={500}>
          Images
        </Text>
        <AttachmentsUpload
          value={files.images}
          onChange={(images) => onChange({ ...files, images })}
        />
      </Stack>

      <Stack gap={6}>
        <Text fz="sm" fw={500}>
          Documents
        </Text>
        <AttachmentsUpload
          value={files.documents}
          onChange={(documents) => onChange({ ...files, documents })}
          accept={DOCUMENT_MIME_TYPES}
          title="Drag documents here or click to upload"
          hint="PDF, Word, Excel or images"
          icon={IconFileUpload}
        />
      </Stack>
    </Stack>
  </FormSection>
);

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
        title="Ownership"
        description="Which company owns it and who inspects it"
        icon={IconBuilding}
      >
        <Grid.Col span={HALF}>
          <CompaniesSelect
            selectProps={{
              label: "Company",
              placeholder: "Select company",
              ...form.getInputProps("company"),
            }}
          />
        </Grid.Col>

        <Grid.Col span={HALF}>
          <UsersSelect
            selectProps={{
              label: "Inspector",
              placeholder: "Select inspector",
              ...form.getInputProps("inspector"),
            }}
          />
        </Grid.Col>
      </FormSection>

      {/* Driver details belong to an assigned vehicle only; an unassigned one
          skips them entirely, and they are not sent. */}
      {isAssignedStatus(form.values.status) && (
        <FormSection
          title="Driver details"
          description="Who drives this vehicle and their license"
          icon={IconSteeringWheel}
        >
          <Grid.Col span={HALF}>
            <UsersSelect
              selectProps={{
                withAsterisk: true,
                label: "User",
                placeholder: "Select user",
                ...form.getInputProps("driverDetails.user"),
              }}
            />
          </Grid.Col>

          <Grid.Col span={HALF}>
            <TextInput
              withAsterisk
              label="License number"
              placeholder="123456"
              leftSection={<IconLicense size={16} />}
              {...form.getInputProps("driverDetails.licenseNumber")}
            />
          </Grid.Col>

          {date("driverDetails.licenseExpiry", "License expiry", {
            withAsterisk: true,
            minDate: new Date(),
          })}

          {date("assignedOn", "Assigned on", { maxDate: new Date() })}
        </FormSection>
      )}
    </>
  );
};
