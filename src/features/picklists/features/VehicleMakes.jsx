import Picklists from "src/features/picklists/Picklists";

const VehicleMakes = () => {
  return (
    <Picklists featureName="vehicle make" resource="Vehicle" field="make">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default VehicleMakes;
