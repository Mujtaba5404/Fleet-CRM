import { Input, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import FiltersDrawer from "../components/FiltersDrawer";
import ListToolbar from "../components/ListToolbar";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import AddInsuranceModalButton from "../features/Insurance/AddInsuranceModalButton";
import InsuranceTable from "../features/Insurance/InsuranceTable";

const FILTER_LABELS = {
  policyNumber: "Policy",
  licensePlate: "Plate",
  createdAt: "Logged",
};

const InsurancePage = () => (
  <>
    <PageHeader
      title="Insurance"
      description="Policies, coverage, premiums and renewal dates."
      breadcrumbs={[{ label: "Fleet" }, { label: "Insurance" }]}
      actions={
        <>
          <FiltersDrawer title="Filter policies">
            {({ filters, setFilters }) => (
              <Stack gap="md">
                <SearchInput
                  label="Policy number"
                  placeholder="e.g. POL-2024-001"
                  value={filters.policyNumber || ""}
                  onChange={(value) => setFilters({ policyNumber: value })}
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
                    mt={4}
                    value={filters.createdAt || [null, null]}
                    onChange={(value) => setFilters({ createdAt: value })}
                  />
                </Input.Wrapper>
              </Stack>
            )}
          </FiltersDrawer>

          <AddInsuranceModalButton />
        </>
      }
    />

    <InsuranceTable
      toolbar={({ totalRecords, isLoading }) => (
        <ListToolbar
          totalRecords={totalRecords}
          isLoading={isLoading}
          noun="policy"
          nounPlural="policies"
          search={{ key: "policyNumber", placeholder: "Search by policy no.…" }}
          filterLabels={FILTER_LABELS}
        />
      )}
    />
  </>
);

export default InsurancePage;
