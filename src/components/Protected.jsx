import { Outlet } from "react-router-dom";
import CanAccess from "./CanAccess";

/** A route the role cannot open goes back to "/", which finds one it can. */
const Protected = ({
  resource,
  action = "read",
  redirectPath = "/",
  children,
}) => {
  return (
    <CanAccess
      resource={resource}
      action={action}
      redirect
      redirectPath={redirectPath}
    >
      {children ?? <Outlet />}
    </CanAccess>
  );
};

export default Protected;
