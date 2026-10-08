import Picklists from "src/features/picklists/Picklists";

const TaxStatus = () => {
  return (
    <Picklists featureName="tax status" resource="Taxation" field="status">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default TaxStatus;
