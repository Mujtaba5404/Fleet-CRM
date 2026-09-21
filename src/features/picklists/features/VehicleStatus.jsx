import Picklists from "src/features/picklists/Picklists";

const VehicleStatus = () => {
  return (
    <Picklists featureName="vehicle status" resource="Vehicle" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default VehicleStatus;
