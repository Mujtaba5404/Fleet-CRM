import { Route } from "react-router-dom";
import InsuranceDetails from "../features/Insurance/InsuranceDetails";
import InsuranceTable from "../features/Insurance/InsuranceTable";

export const insuranceRoutes = (
  <Route path="insurance">
    <Route index element={<InsuranceTable />} />
  </Route>
);

export const insuranceDetailRoutes = (
  <Route path="insurance/:id" element={<InsuranceDetails />} />
);