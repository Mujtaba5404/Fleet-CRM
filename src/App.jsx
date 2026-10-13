import { Navigate, Route, Routes } from "react-router-dom";
import HomeRedirect from "./components/HomeRedirect";
import Protected from "./components/Protected";
import RequireAuth from "./components/RequireAuth";
import RESOURCES from "./constants/RESOURCES";
import Login from "./features/auth/Login";
import AppLayout from "./layouts/AppLayout";
import { findNavLink, HOME_PATH } from "./layouts/navigation";
import SummaryPage from "./pages/SummaryPage";
import NotFound from "./pages/NotFound";
import { accessRoutes } from "./routes/access";
import { adminSettingsRoutes } from "./routes/adminSettings";
import {
  depreciationDetailRoutes,
  depreciationRoutes,
} from "./routes/depreciations";
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
        <Route index element={<HomeRedirect />} />
        {/* The summary used to be called the dashboard; keep old links working. */}
        <Route path="dashboard" element={<Navigate to={HOME_PATH} replace />} />

        {/* Each section opens only for roles that can read its resource. */}
        <Route
          element={<Protected resource={findNavLink(HOME_PATH).resource} />}
        >
          <Route path="summary" element={<SummaryPage />} />
        </Route>

        <Route element={<Protected resource={RESOURCES.FLEET} />}>
          {fleetRoutes}
          {fleetDetailRoutes}
        </Route>

        <Route element={<Protected resource={RESOURCES.MAINTENANCE} />}>
          {maintenanceRoutes}
          {maintenanceDetailRoutes}
        </Route>

        <Route element={<Protected resource={RESOURCES.INSURANCE} />}>
          {insuranceRoutes}
          {insuranceDetailRoutes}
        </Route>

        <Route element={<Protected resource={RESOURCES.TAXATION} />}>
          {taxRoutes}
          {taxDetailRoutes}
        </Route>

        <Route element={<Protected resource={RESOURCES.DEPRECIATION} />}>
          {depreciationRoutes}
          {depreciationDetailRoutes}
        </Route>

        {adminSettingsRoutes}
        {accessRoutes}
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
