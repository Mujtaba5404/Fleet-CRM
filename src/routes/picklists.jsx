import { Route } from "react-router-dom";
import Picklists from "../pages/Picklists";
import Protected from "../components/Protected";
import FleetMake from "../features/picklists/features/FleetMake";
import FleetModel from "../features/picklists/features/FleetModel";
import FleetType from "../features/picklists/features/FleetType";
import FleetFuelType from "../features/picklists/features/FleetFuelType";
import FleetTransmission from "../features/picklists/features/FleetTransmission";
import FleetStatus from "../features/picklists/features/fleetStatus";
import FleetCondition from "../features/picklists/features/FleetCondition";
import MaintenanceType from "../features/picklists/features/MaintenanceType";
import MaintenanceStatus from "../features/picklists/features/MaintenanceStatus";
import MaintenancePriority from "../features/picklists/features/MaintenancePriority";
import MaintenanceProvider from "../features/picklists/features/MaintenanceProvider";
import MaintenanceChecklistItem from "../features/picklists/features/MaintenanceChecklistItem";
import MaintenanceChecklistStatus from "../features/picklists/features/MaintenanceChecklistStatus";
import MaintenanceChecklistCondition from "../features/picklists/features/MaintenanceChecklistCondition";
import TaxJurisdiction from "../features/picklists/features/TaxJurisdiction";
import TaxStatus from "../features/picklists/features/TaxStatus";

export const picklistRoutes = (
  <Route
    path="picklists"
    element={
      // <Protected resource="picklist" action="read">
      <Picklists />
      // </Protected>
    }
  >
    <Route index element={<FleetMake />} />
    <Route path="fleet-make" element={<FleetMake />} />
    <Route path="fleet-model" element={<FleetModel />} />
    <Route path="fleet-type" element={<FleetType />} />
    <Route path="fleet-fuel-type" element={<FleetFuelType />} />
    <Route path="fleet-transmission" element={<FleetTransmission />} />
    <Route path="fleet-status" element={<FleetStatus />} />
    <Route path="fleet-condition" element={<FleetCondition />} />
    <Route path="maintenance-type" element={<MaintenanceType />} />
    <Route path="maintenance-status" element={<MaintenanceStatus />} />
    <Route path="maintenance-priority" element={<MaintenancePriority />} />
    <Route path="maintenance-provider" element={<MaintenanceProvider />} />
    <Route path="checklist-item" element={<MaintenanceChecklistItem />} />
    <Route path="checklist-status" element={<MaintenanceChecklistStatus />} />
    <Route
      path="checklist-condition"
      element={<MaintenanceChecklistCondition />}
    />
    <Route path="tax-jurisdiction" element={<TaxJurisdiction />} />
    <Route path="tax-status" element={<TaxStatus />} />
  </Route>
);
