import { usePicklists } from "src/context/PicklistContext";
import Picklists from "src/features/picklists/Picklists";
import PicklistsSelect from "src/features/picklists/components/PicklistsSelect";

const AdditionalFields = () => {
  const { form, resource } = usePicklists();

  return (
    <PicklistsSelect
      queryObject={{ resource, field: "make" }}
      selectProps={{
        required: true,
        label: "vehicle make",
        ...form.getInputProps("parentPicklist"),
      }}
    />
  );
};

const VehicleModels = () => {
  return (
    <Picklists featureName="vehicle model" resource="Vehicle" field="model">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }}>
        <AdditionalFields />
      </Picklists.Modal>

      <Picklists.List />
    </Picklists>
  );
};

export default VehicleModels;
