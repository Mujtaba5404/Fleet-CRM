import { Route } from "react-router-dom";
import Protected from "../components/Protected";
import RESOURCES from "../constants/RESOURCES";
import RoleDetails from "../features/roles/RoleDetails";
import RolesPage from "../pages/RolesPage";

export const roleRoutes = (
  <Route path="roles" element={<Protected resource={RESOURCES.ROLE} />}>
    <Route index element={<RolesPage />} />
    <Route path=":id" element={<RoleDetails />} />
  </Route>
);
