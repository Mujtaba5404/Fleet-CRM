import { Navigate, Route } from "react-router-dom";
import AdminSettings from "../pages/AdminSettings";
import { picklistRoutes } from "./picklists";

export const adminSettingsRoutes = (
  <Route path="admin-settings" element={<AdminSettings />}>
    <Route index element={<Navigate to="picklists" replace />} />

    {picklistRoutes}
  </Route>
);
