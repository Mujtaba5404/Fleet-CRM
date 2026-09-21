import { Route } from "react-router-dom";
import FleetTable from "../features/fleets/FleetTable";
import MaintenanceDetails from "../features/maintenance/MaintenanceDetails";
import MaintenanceTable from "../features/maintenance/MaintenanceTable";
import Dashboard from "../pages/Dashboard";

export const maintenanceRoutes = (
  <Route path="maintenance">
    <Route index element={<MaintenanceTable />} />
  </Route>
);

export const maintenanceDetailRoutes = (
  <Route path="maintenance/:id" element={<MaintenanceDetails />} />
);