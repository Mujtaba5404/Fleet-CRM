import Picklists from "../../../features/picklists/Picklists";

const TaxJurisdiction = () => {
  return (
    <Picklists
      featureName="tax jurisdiction"
      resource="Taxation"
      field="jurisdiction"
    >
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default TaxJurisdiction;
