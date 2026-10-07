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
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { SESSION_EXPIRED_EVENT } from "../api/index";

const RequireAuth = () => {
  const [auth, , removeAuth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // The API layer raises this when a refresh could not save the session.
  // Cached records go with it, so the next person to sign in on this machine
  // never sees the previous session's data while their own loads.
  useEffect(() => {
    const handleExpiry = () => {
      removeAuth();
      queryClient.clear();
      navigate("/login", { replace: true });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpiry);

    return () =>
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpiry);
  }, [navigate, queryClient, removeAuth]);

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
