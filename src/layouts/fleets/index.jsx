import { Button, Group } from "@mantine/core";
import AddfleetModalButton from "../../features/fleets/AddfleetModalButton";
import useFilters from "../../hooks/useFilters";
import TabbedLayout from "../TabbedLayout";
import AddMaintenanceModalButton from "../../features/maintenance/AddMaintenanceModalButton";

const FleetsLayout = () => {
  const { filters, resetFilters } = useFilters();

  return (
    <TabbedLayout
      tabs={[
        { value: "dashboard", label: "Dashboard", path: "/fleets/dashboard" },
        { value: "fleets", label: "Fleets", path: "/fleets" },
        { value: "maintenance", label: "Maintenance", path: "/maintenance" },
      ]}
      rightSlots={{
        fleets: (
          <Group>
            {Object.keys(filters).length > 0 && (
              <Button color="red" onClick={() => resetFilters()}>
                Clear filters
              </Button>
            )}
            <AddfleetModalButton />
          </Group>
        ),
        maintenance: (
          <Group>
            {Object.keys(filters).length > 0 && (
              <Button color="red" onClick={() => resetFilters()}>
                Clear filters
              </Button>
            )}
            <AddMaintenanceModalButton />
          </Group>
        ),
      }}
    />
  );
};

export default FleetsLayout;
