import { usePicklists } from "../../../context/PicklistContext";
import Picklists from "../Picklists";
import PicklistsSelect from "../components/PicklistsSelect";

/** Every model belongs to a make: its id is sent as `parentPicklist`. */
const AdditionalFields = () => {
  const { form, resource } = usePicklists();

  return (
    <PicklistsSelect
      queryObject={{ resource, field: "make" }}
      selectProps={{
        withAsterisk: true,
        label: "Make",
        placeholder: "Select make",
        searchable: true,
        ...form.getInputProps("parentPicklist"),
      }}
    />
  );
};

const VALIDATE = {
  parentPicklist: (value) =>
    value ? null : "Pick the make this model belongs to",
};

const FleetModel = () => {
  return (
    <Picklists
      featureName="fleet model"
      resource="Fleet"
      field="model"
      validate={VALIDATE}
    >
      <Picklists.AddButton />

      <Picklists.Modal>
        <AdditionalFields />
      </Picklists.Modal>

      <Picklists.List />
    </Picklists>
  );
};

export default FleetModel;
