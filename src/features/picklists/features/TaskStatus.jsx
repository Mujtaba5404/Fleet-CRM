import Picklists from "src/features/picklists/Picklists";

const TaskStatus = () => {
  return (
    <Picklists featureName="task status" resource="Task" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default TaskStatus;
