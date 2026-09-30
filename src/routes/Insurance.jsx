import { Route } from "react-router-dom";
import InsuranceDetails from "../features/Insurance/InsuranceDetails";
import InsurancePage from "../pages/InsurancePage";

export const insuranceRoutes = (
  <Route path="insurance">
    <Route index element={<InsurancePage />} />
  </Route>
);

export const insuranceDetailRoutes = (
  <Route path="insurance/:id" element={<InsuranceDetails />} />
);
