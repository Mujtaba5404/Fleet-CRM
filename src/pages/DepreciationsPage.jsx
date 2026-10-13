import ListToolbar from "../components/ListToolbar";
import PageHeader from "../components/PageHeader";
import AddDepreciationModalButton from "../features/depreciations/AddDepreciationModalButton";
import DepreciationTable from "../features/depreciations/DepreciationTable";

const DepreciationsPage = () => (
  <>
    <PageHeader
      title="Depreciation"
      description="How each vehicle's value falls over its useful life, and what it is worth today."
      breadcrumbs={[{ label: "Fleet" }, { label: "Depreciation" }]}
      actions={<AddDepreciationModalButton />}
    />

    <DepreciationTable
      toolbar={({ totalRecords, isLoading }) => (
        <ListToolbar
          totalRecords={totalRecords}
          isLoading={isLoading}
          noun="depreciation"
        />
      )}
    />
  </>
);

export default DepreciationsPage;
