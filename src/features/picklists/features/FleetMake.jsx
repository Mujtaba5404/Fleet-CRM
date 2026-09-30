import Picklists from "../../../features/picklists/Picklists";

const FleetMake = () => {
  return (
    <Picklists featureName="fleet make" resource="Fleet" field="make">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default FleetMake;
