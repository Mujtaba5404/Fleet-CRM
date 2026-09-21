import Picklists from "src/features/picklists/Picklists";

const ProjectType = () => {
  return (
    <Picklists featureName="project type" resource="Project" field="type">
      <Picklists.AddButton />

      <Picklists.Modal fieldsConfig={{ isDefault: false }} />

      <Picklists.List />
    </Picklists>
  );
};

export default ProjectType;
