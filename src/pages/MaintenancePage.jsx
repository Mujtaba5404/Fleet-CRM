import { Input, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import FiltersDrawer from "../components/FiltersDrawer";
import ListToolbar from "../components/ListToolbar";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import AddMaintenanceModalButton from "../features/maintenance/AddMaintenanceModalButton";
import MaintenanceTable from "../features/maintenance/MaintenanceTable";

const FILTER_LABELS = {
  licensePlate: "Plate",
  createdAt: "Logged",
};

const MaintenancePage = () => (
  <>
    <PageHeader
      title="Maintenance"
      description="Service jobs, costs, inspection checklists and condition photos."
      breadcrumbs={[{ label: "Fleet" }, { label: "Maintenance" }]}
      actions={
        <>
          <FiltersDrawer title="Filter maintenance">
            {({ filters, setFilters }) => (
              <Stack gap="md">
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

          <AddMaintenanceModalButton />
        </>
      }
    />

    <MaintenanceTable
      toolbar={({ totalRecords, isLoading }) => (
        <ListToolbar
          totalRecords={totalRecords}
          isLoading={isLoading}
          noun="job"
          search={{ key: "licensePlate", placeholder: "Search by plateâ€¦" }}
          filterLabels={FILTER_LABELS}
        />
      )}
    />
  </>
);

export default MaintenancePage;
