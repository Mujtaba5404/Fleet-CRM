import { Navigate, Route } from "react-router-dom";
import AdminSettings from "../pages/AdminSettings";
import { picklistRoutes } from "./picklists";
import { roleRoutes } from "./roles";

export const adminSettingsRoutes = (
  <Route path="admin-settings" element={<AdminSettings />}>
    <Route index element={<Navigate to="picklists" replace />} />

    {picklistRoutes}
    {roleRoutes}
  </Route>
);
