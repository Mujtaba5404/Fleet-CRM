import { Outlet } from "react-router-dom";
import CanAccess from "./CanAccess";

const Protected = ({ resource, action, redirectPath = "/404", children }) => {
  return (
    <CanAccess resource={resource} action={action} redirect redirectPath={redirectPath}>
      {children ?? <Outlet />}
    </CanAccess>
  );
};

export default Protected;
