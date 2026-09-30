import { Badge, Group, Switch, Tooltip } from "@mantine/core";
import { IconUserExclamation } from "@tabler/icons-react";
import { usePicklists } from "../../../context/PicklistContext";
import Picklists from "../Picklists";
import PicklistsSelect from "../components/PicklistsSelect";

const AdditionalFields = () => {
  const { form, resource } = usePicklists();

  return (
    <>
      <PicklistsSelect
        queryObject={{ resource, field: "category" }}
        selectProps={{
          required: true,
          label: "fleet category",
          ...form.getInputProps("parentPicklist"),
        }}
      />
      <Switch
        label="Requires Employee"
        description="If enabled, employee is mandatory when creating an fleet"
        tt={"initial"}
        {...form.getInputProps("meta.requiresEmployee", { type: "checkbox" })}
      />
    </>
  );
};

const FleetCondition = () => {
  return (
    <Picklists featureName="fleet condition" resource="Fleet" field="condition">
      <Picklists.AddButton />

      <Picklists.Modal>
        <AdditionalFields />
      </Picklists.Modal>

      <Picklists.List>
        {(picklist) => (
          <Group gap={"xs"} mr={"auto"}>
            <Badge color={picklist.color}>{picklist.title}</Badge>

            {picklist.meta.requiresEmployee && (
              <Tooltip label="Employee is mandatory for fleets in this sub-category">
                <IconUserExclamation size={18} />
              </Tooltip>
            )}
          </Group>
        )}
      </Picklists.List>
    </Picklists>
  );
};

export default FleetCondition;
