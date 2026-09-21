import Picklists from "src/features/picklists/Picklists";

const TaskPriorities = () => {
  return (
    <Picklists featureName="task priority" resource="Task" field="priority">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default TaskPriorities;
