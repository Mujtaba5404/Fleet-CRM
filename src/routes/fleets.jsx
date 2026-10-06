import { Navigate, Route } from "react-router-dom";
import FleetDetails from "../features/fleets/FleetDetails";
import FleetSummaryPage from "../pages/FleetSummaryPage";
import FleetsPage from "../pages/FleetsPage";

export const fleetRoutes = (
  <Route path="fleets">
    <Route index element={<FleetsPage />} />

    {/* Static segments outrank `fleets/:id`, so these never hit the detail route. */}
    <Route path="summary" element={<FleetSummaryPage />} />

    {/* The dashboard used to live under /fleets; keep old links working. */}
    <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />
  </Route>
);

export const fleetDetailRoutes = (
  <Route path="fleets/:id" element={<FleetDetails />} />
);
