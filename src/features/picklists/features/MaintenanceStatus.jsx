import Picklists from "../../../features/picklists/Picklists";

const MaintenanceStatus = () => {
  return (
    <Picklists
      featureName="maintenance status"
      resource="Maintenance"
      field="status"
    >
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default MaintenanceStatus;
