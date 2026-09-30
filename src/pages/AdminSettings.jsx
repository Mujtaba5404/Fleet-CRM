import { Outlet } from "react-router-dom";

/**
 * Shell for everything under /admin-settings.
 *
 * Each settings section renders its own PageHeader, so this is deliberately a
 * pass through. It exists as a mount point for future sections (roles, users,
 * company profile…) and for a permission guard around the whole area.
 */
const AdminSettings = () => <Outlet />;

export default AdminSettings;
