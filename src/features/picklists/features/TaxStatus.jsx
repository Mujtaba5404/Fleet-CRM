import Picklists from "src/features/picklists/Picklists";

const TaxStatus = () => {
  return (
    <Picklists featureName="tax status" resource="Tax" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default TaxStatus;
