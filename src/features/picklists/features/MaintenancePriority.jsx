import Picklists from "../../../features/picklists/Picklists";


const MaintenancePriority = () => {
  return (
    <Picklists featureName="maintenance priority" resource="Maintenance" field="priority">
      <Picklists.AddButton />

      <Picklists.Modal/>

      <Picklists.List />
    </Picklists>
  );
};

export default MaintenancePriority;
