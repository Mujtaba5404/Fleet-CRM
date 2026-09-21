import Picklists from "../Picklists";

const FleetStatus = () => {
  return (
    <Picklists featureName="fleet status" resource="Fleet" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default FleetStatus;
