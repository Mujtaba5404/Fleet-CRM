import Picklists from "src/features/picklists/Picklists";

const ProjectStatus = () => {
  return (
    <Picklists featureName="Project status" resource="Project" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default ProjectStatus;
