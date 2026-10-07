import { Navigate, Route } from "react-router-dom";
import FleetDetails from "../features/fleets/FleetDetails";
import FleetsPage from "../pages/FleetsPage";

export const fleetRoutes = (
  <Route path="fleets">
    <Route index element={<FleetsPage />} />

    {/* Static segments outrank `fleets/:id`, so these never hit the detail route.
        The old fleet summary and dashboard both live on /summary now; keep old
        links working. */}
    <Route path="summary" element={<Navigate to="/summary" replace />} />
    <Route path="dashboard" element={<Navigate to="/summary" replace />} />
  </Route>
);

export const fleetDetailRoutes = (
  <Route path="fleets/:id" element={<FleetDetails />} />
);
