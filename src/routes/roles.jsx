import { Route } from "react-router-dom";
import RoleDetails from "../features/roles/RoleDetails";
import RolesPage from "../pages/RolesPage";

export const roleRoutes = (
  <Route path="roles">
    <Route index element={<RolesPage />} />
    <Route path=":id" element={<RoleDetails />} />
  </Route>
);
