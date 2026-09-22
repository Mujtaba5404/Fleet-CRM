import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/auth/Login";
import RequireAuth from "./components/RequireAuth";
import AppLayout from "./layouts/AppLayout";
import NotFound from "./pages/NotFound";
import { adminSettingsRoutes } from "./routes/adminSettings";
import { fleetDetailRoutes, fleetRoutes } from "./routes/fleets";
import {
  maintenanceDetailRoutes,
  maintenanceRoutes,
} from "./routes/maintenance";
import FleetsLayout from "./layouts/fleets";
import { insuranceDetailRoutes, insuranceRoutes } from "./routes/Insurance";

const HOME = "/fleets/dashboard";

const App = () => (
  <Routes>
    <Route path="login" element={<Login />} />

    <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to={HOME} replace />} />
        <Route path="dashboard" element={<Navigate to={HOME} replace />} />

        <Route element={<FleetsLayout />}>
          {fleetRoutes}
          {maintenanceRoutes}
          {insuranceRoutes}
        </Route>

        {fleetDetailRoutes}
        {maintenanceDetailRoutes}
        {insuranceDetailRoutes}

        {adminSettingsRoutes}
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
