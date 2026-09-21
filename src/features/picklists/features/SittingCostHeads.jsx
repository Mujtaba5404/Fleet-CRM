import { Badge, Select } from "@mantine/core";
import CURRENCY from "src/constants/CURRENCY";
import { usePicklists } from "src/context/PicklistContext";
import Picklists from "src/features/picklists/Picklists";

const AdditionalFields = () => {
  const { form } = usePicklists();

  return <Select required label="currency" defaultValue={CURRENCY.PKR} data={Object.values(CURRENCY)} {...form.getInputProps("meta.currency")} />;
};

const SittingCostHeads = () => {
  return (
    <Picklists featureName="sitting cost head" resource="SittingCost" field="costHead">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }}>
        <AdditionalFields />
      </Picklists.Modal>

      <Picklists.List>
        {(picklist) => (
          <Badge color={picklist.color}>
            {picklist.title} - {picklist.meta?.currency}
          </Badge>
        )}
      </Picklists.List>
    </Picklists>
  );
};

export default SittingCostHeads;
