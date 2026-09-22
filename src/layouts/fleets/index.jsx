import { Button, Group } from "@mantine/core";
import AddfleetModalButton from "../../features/fleets/AddfleetModalButton";
import useFilters from "../../hooks/useFilters";
import TabbedLayout from "../TabbedLayout";
import AddMaintenanceModalButton from "../../features/maintenance/AddMaintenanceModalButton";
import AddInsuranceModalButton from "../../features/Insurance/AddInsuranceModalButton";

const FleetsLayout = () => {
  const { filters, resetFilters } = useFilters();

  return (
    <TabbedLayout
      tabs={[
        { value: "dashboard", label: "Dashboard", path: "/fleets/dashboard" },
        { value: "fleets", label: "Fleets", path: "/fleets" },
        { value: "maintenance", label: "Maintenance", path: "/maintenance" },
        { value: "insurance", label: "Insurance", path: "/insurance" },
        { value: "insurance", label: "Tax", path: "/insurance" },
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
        insurance: (
          <Group>
            {Object.keys(filters).length > 0 && (
              <Button color="red" onClick={() => resetFilters()}>
                Clear filters
              </Button>
            )}
            <AddInsuranceModalButton />
          </Group>
        ),
      }}
    />
  );
};

export default FleetsLayout;
