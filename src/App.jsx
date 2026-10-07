import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Login from "./features/auth/Login";
import AppLayout from "./layouts/AppLayout";
import { HOME_PATH } from "./layouts/navigation";
import SummaryPage from "./pages/SummaryPage";
import NotFound from "./pages/NotFound";
import { adminSettingsRoutes } from "./routes/adminSettings";
import { fleetDetailRoutes, fleetRoutes } from "./routes/fleets";
import { insuranceDetailRoutes, insuranceRoutes } from "./routes/Insurance";
import {
  maintenanceDetailRoutes,
  maintenanceRoutes,
} from "./routes/maintenance";
import { taxDetailRoutes, taxRoutes } from "./routes/tax";

/**
 * Every authenticated screen sits directly under <AppLayout />, which owns the
 * sidebar. List and detail routes are siblings, so navigating into a record
 * keeps its section highlighted instead of dropping out of the shell.
 */
const App = () => (
  <Routes>
    <Route path="login" element={<Login />} />

    <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={HOME_PATH} replace />} />
        <Route path="summary" element={<SummaryPage />} />
        {/* The summary used to be called the dashboard; keep old links working. */}
        <Route path="dashboard" element={<Navigate to={HOME_PATH} replace />} />

        {fleetRoutes}
        {fleetDetailRoutes}

        {maintenanceRoutes}
        {maintenanceDetailRoutes}

        {insuranceRoutes}
        {insuranceDetailRoutes}

        {taxRoutes}
        {taxDetailRoutes}

        {adminSettingsRoutes}
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
