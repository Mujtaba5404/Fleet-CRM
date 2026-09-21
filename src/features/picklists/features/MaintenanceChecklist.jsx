import Picklists from "../Picklists";

const MaintenanceChecklist = () => {
  return (
    <Picklists
      featureName="maintenance checklist"
      resource="Maintenance"
      field="checklist.status"
    >
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default MaintenanceChecklist;
