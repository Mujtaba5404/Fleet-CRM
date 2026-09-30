import { Route } from "react-router-dom";
import TaxDetails from "../features/tax/TaxDetails";
import TaxPage from "../pages/TaxPage";

export const taxRoutes = (
  <Route path="tax">
    <Route index element={<TaxPage />} />
  </Route>
);

export const taxDetailRoutes = (
  <Route path="tax/:id" element={<TaxDetails />} />
);
