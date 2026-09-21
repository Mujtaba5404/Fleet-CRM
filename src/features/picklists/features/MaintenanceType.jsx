import Picklists from "../../../features/picklists/Picklists";


const MaintenanceType = () => {
  return (
    <Picklists featureName="maintenance type" resource="Maintenance" field="type">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default MaintenanceType;
