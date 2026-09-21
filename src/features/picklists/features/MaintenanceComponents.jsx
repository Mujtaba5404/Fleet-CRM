import Picklists from "../../../features/picklists/Picklists";


const MaintenanceComponents = () => {
  return (
    <Picklists featureName="maintenance components" resource="Maintenance" field="components.component">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default MaintenanceComponents;
