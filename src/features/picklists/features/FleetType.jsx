import Picklists from "../../../features/picklists/Picklists";

const FleetType = () => {
  return (
    <Picklists featureName="fleet type" resource="Fleet" field="type">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default FleetType;
