import { Route } from "react-router-dom";
import FleetDetails from "../features/fleets/FleetDetails";
import FleetTable from "../features/fleets/FleetTable";
import FleetsLayout from "../layouts/fleets";
import Dashboard from "../pages/Dashboard";

export const fleetRoutes = (
  <Route path="fleets">
    <Route index element={<FleetTable />} />
    <Route path="dashboard" element={<Dashboard />} />
  </Route>
);

export const fleetDetailRoutes = (
  <Route path="fleets/:id" element={<FleetDetails />} />
);