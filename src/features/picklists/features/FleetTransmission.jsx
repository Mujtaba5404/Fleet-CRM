import Picklists from "../Picklists";

const FleetTransmission = () => {
  return (
    <Picklists
      featureName="fleet transmission"
      resource="Fleet"
      field="transmission"
    >
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false, acronym: true }} />

      <Picklists.List />
    </Picklists>
  );
};

export default FleetTransmission;
