import { Route } from "react-router-dom";
import MaintenanceDetails from "../features/maintenance/MaintenanceDetails";
import MaintenancePage from "../pages/MaintenancePage";

export const maintenanceRoutes = (
  <Route path="maintenance">
    <Route index element={<MaintenancePage />} />
  </Route>
);

export const maintenanceDetailRoutes = (
  <Route path="maintenance/:id" element={<MaintenanceDetails />} />
);
