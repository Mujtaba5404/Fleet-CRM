import Picklists from "../../../features/picklists/Picklists";


const MaintenanceProvider = () => {
  return (
    <Picklists featureName="maintenance provider" resource="Maintenance" field="provider">
      <Picklists.AddButton />

      <Picklists.Modal/>

      <Picklists.List />
    </Picklists>
  );
};

export default MaintenanceProvider;
