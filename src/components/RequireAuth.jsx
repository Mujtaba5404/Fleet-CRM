// import { useLocalStorage } from "@mantine/hooks";
// import { jwtDecode } from "jwt-decode";
// import { useEffect } from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const RequireAuth = () => {
//   const [auth, , removeAuth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });

//   // const tokenExpired = isTokenExpired(auth?.token);
//     const invalidAuthState = !auth?.effectivePermissions;

//   const shouldLogout = invalidAuthState;

//   useEffect(() => {
//     if (shouldLogout) {
//       removeAuth();
//     }
//   }, [shouldLogout, removeAuth]);

//   if (shouldLogout) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Outlet />;
// };

// const isTokenExpired = (token) => {
//   if (!token) return true;

//   try {
//     const decoded = jwtDecode(token);

//     return !decoded?.exp || decoded.exp * 1000 < Date.now();
//   } catch {
//     return true;
//   }
// };

// export default RequireAuth;
import { useLocalStorage } from "@mantine/hooks";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

const RequireAuth = () => {
  const [auth, , removeAuth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });

  const shouldLogout = !auth;

  useEffect(() => {
    if (shouldLogout) {
      removeAuth();
    }
  }, [shouldLogout, removeAuth]);

  if (shouldLogout) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
