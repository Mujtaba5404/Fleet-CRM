import Picklists from "../Picklists";

const MaintenanceChecklistCondition = () => {
  return (
    <Picklists featureName="maintenance condition" resource="Maintenance" field="checklist.condition">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default MaintenanceChecklistCondition;
