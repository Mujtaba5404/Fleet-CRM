import { Navigate } from "react-router-dom";
import useCanAccess, { usePermissionsLoaded } from "../hooks/useCanAccess";

const CanAccess = ({
  resource = "",
  action = "",
  redirect = false,
  redirectPath = "",
  options = { resourcesMode: "any", actionsMode: "any" },
  children,
}) => {
  const hasAccess = useCanAccess(resource, action, options);
  const loaded = usePermissionsLoaded();

  if (hasAccess) {
    return children;
  }

  // Only redirect once permissions are known; until then just show nothing.
  return redirect && loaded ? (
    <Navigate to={redirectPath ?? -1} replace />
  ) : null;
};

export default CanAccess;
