import Picklists from "src/features/picklists/Picklists";

const ProjectServices = () => {
  return (
    <Picklists featureName="project services" resource="Project" field="services">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ color: false, isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default ProjectServices;
