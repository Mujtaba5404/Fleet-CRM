import Picklists from "../Picklists";

const FleetModel = () => {
  return (
    <Picklists featureName="fleet model" resource="Fleet" field="model">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default FleetModel;
