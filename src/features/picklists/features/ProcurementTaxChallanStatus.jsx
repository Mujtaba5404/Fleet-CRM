import Picklists from "src/features/picklists/Picklists";

const ProcurementTaxChallanStatus = () => {
  return (
    <Picklists featureName="procurement tax challan status" resource="Procurement" field="taxChallanStatus">
      <Picklists.AddButton />

      <Picklists.Modal />

      <Picklists.List />
    </Picklists>
  );
};

export default ProcurementTaxChallanStatus;
