import { Route } from "react-router-dom";
import DepreciationDetails from "../features/depreciations/DepreciationDetails";
import DepreciationsPage from "../pages/DepreciationsPage";

export const depreciationRoutes = (
  <Route path="depreciations">
    <Route index element={<DepreciationsPage />} />
  </Route>
);

export const depreciationDetailRoutes = (
  <Route path="depreciations/:id" element={<DepreciationDetails />} />
);
