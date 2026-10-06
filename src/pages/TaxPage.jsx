import { Input, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import FiltersDrawer from "../components/FiltersDrawer";
import ListToolbar from "../components/ListToolbar";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import AddTaxModalButton from "../features/tax/AddTaxModalButton";
import TaxTable from "../features/tax/TaxTable";

const FILTER_LABELS = {
  challanNumber: "Challan",
  licensePlate: "Plate",
  createdAt: "Logged",
};

const TaxPage = () => (
  <>
    <PageHeader
      title="Tax"
      description="Challans, filing dates, jurisdictions and amounts due."
      breadcrumbs={[{ label: "Fleet" }, { label: "Tax" }]}
      actions={
        <>
          <FiltersDrawer title="Filter tax records">
            {({ filters, setFilters }) => (
              <Stack gap="md">
                <SearchInput
                  label="Challan number"
                  placeholder="e.g. CH-2024-001"
                  value={filters.challanNumber || ""}
                  onChange={(value) => setFilters({ challanNumber: value })}
                />

                <SearchInput
                  label="Vehicle plate"
                  placeholder="e.g. ABC-123"
                  value={filters.licensePlate || ""}
                  onChange={(value) => setFilters({ licensePlate: value })}
                />

                <Input.Wrapper label="Logged between">
                  <DatePicker
                    type="range"
                    size="sm"
                    fullWidth
                    mt={4}
                    value={filters.createdAt || [null, null]}
                    onChange={(value) => setFilters({ createdAt: value })}
                  />
                </Input.Wrapper>
              </Stack>
            )}
          </FiltersDrawer>

          <AddTaxModalButton />
        </>
      }
    />

    <TaxTable
      toolbar={({ totalRecords, isLoading }) => (
        <ListToolbar
          totalRecords={totalRecords}
          isLoading={isLoading}
          noun="challan"
          search={{
            key: "challanNumber",
            placeholder: "Search by challan no.â€¦",
          }}
          filterLabels={FILTER_LABELS}
        />
      )}
    />
  </>
);

export default TaxPage;
