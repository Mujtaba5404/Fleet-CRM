import Picklists from "../../../features/picklists/Picklists";

const MaintenanceChecklistStatus = () => {
  return (
    <Picklists
      featureName="maintenance status"
      resource="Maintenance"
      field="checklist.status"
    >
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default MaintenanceChecklistStatus;
