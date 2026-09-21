import Picklists from "../../../features/picklists/Picklists";


const MaintenanceChecklistItem = () => {
  return (
    <Picklists featureName="maintenance item" resource="Maintenance" field="checklist.item">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default MaintenanceChecklistItem;
