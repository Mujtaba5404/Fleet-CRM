import { usePicklists } from "src/context/PicklistContext";
import Picklists from "src/features/picklists/Picklists";
import PicklistsSelect from "src/features/picklists/components/PicklistsSelect";

const AdditionalFields = () => {
  const { form, resource } = usePicklists();

  return <PicklistsSelect queryObject={{ resource, field: "serviceProvider" }} selectProps={{ required: true, label: "service provider", ...form.getInputProps("parentPicklist") }} />;
};

const SubscriptionServices = () => {
  return (
    <Picklists featureName="subscription service" resource="Subscription" field="service">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }}>
        <AdditionalFields />
      </Picklists.Modal>

      <Picklists.List />
    </Picklists>
  );
};

export default SubscriptionServices;
