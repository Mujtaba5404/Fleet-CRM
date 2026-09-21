import Picklists from "../../../features/picklists/Picklists";


const FleetFuelType = () => {
  return (
    <Picklists featureName="fleet fuel type" resource="Fleet" field="fuelType">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default FleetFuelType;
