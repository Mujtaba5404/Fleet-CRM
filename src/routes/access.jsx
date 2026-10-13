import { Route } from "react-router-dom";
import Protected from "../components/Protected";
import RESOURCES from "../constants/RESOURCES";
import AccessPage from "../pages/AccessPage";

export const accessRoutes = (
  <Route path="access" element={<Protected resource={RESOURCES.ACCESS} />}>
    <Route index element={<AccessPage />} />
  </Route>
);
