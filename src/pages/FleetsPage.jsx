import { Input, Stack } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import FiltersDrawer from "../components/FiltersDrawer";
import ListToolbar from "../components/ListToolbar";
import PageHeader from "../components/PageHeader";
import SearchInput from "../components/SearchInput";
import AddfleetModalButton from "../features/fleets/AddfleetModalButton";
import FleetTable from "../features/fleets/FleetTable";

const FILTER_LABELS = {
  licensePlate: "Plate",
  createdAt: "Added",
};

const FleetsPage = () => (
  <>
    <PageHeader
      title="Vehicles"
      description="Every vehicle in your fleet, with status, cost and odometer."
      breadcrumbs={[{ label: "Fleet" }, { label: "Vehicles" }]}
      actions={
        <>
          <FiltersDrawer title="Filter vehicles">
            {({ filters, setFilters }) => (
              <Stack gap="md">
                <SearchInput
                  label="License plate"
                  placeholder="e.g. ABC-123"
                  value={filters.licensePlate || ""}
                  onChange={(value) => setFilters({ licensePlate: value })}
                />

                <Input.Wrapper label="Added between">
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

          <AddfleetModalButton />
        </>
      }
    />

    <FleetTable
      toolbar={({ totalRecords, isLoading }) => (
        <ListToolbar
          totalRecords={totalRecords}
          isLoading={isLoading}
          noun="vehicle"
          search={{ key: "licensePlate", placeholder: "Search by plateâ€¦" }}
          filterLabels={FILTER_LABELS}
        />
      )}
    />
  </>
);

export default FleetsPage;
