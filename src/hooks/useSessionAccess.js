import { useLocalStorage } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authUserId, fetchMyAccess, mergeRolePermissions } from "../api/access";

// Sign-in fetches the same query, so the shell does not ask again on arrival.
const ACCESS_STALE_TIME = 60 * 1000;

export const sessionAccessQuery = (userId) => ({
  queryKey: ["access", "session", userId],
  queryFn: () => fetchMyAccess(userId),
  staleTime: ACCESS_STALE_TIME,
});

/** What the user's Access record (or its absence) adds to `auth`. */
export const toSessionAccess = (access) => {
  const roles = access?.roles ?? [];

  return {
    // Not `roles`, so the profile's own fields from the login are left alone.
    accessRoles: roles.map(({ _id, title, scope }) => ({ _id, title, scope })),
    effectivePermissions: mergeRolePermissions(roles),
    indexPath: roles.find((role) => role?.indexPath)?.indexPath ?? "/",
    accessError: access
      ? null
      : "Your account has not been given access to Fleet yet. Ask an admin to assign you a role.",
  };
};

/**
 * Fills the session with the signed-in user's Fleet permissions.
 *
 * The Auth360 login only returns the Central profile, so the permissions come
 * from the user's Fleet Access record (its roles, merged) and are written into `auth` as
 * `effectivePermissions`, where every `useCanAccess` reads them. Anything that
 * goes wrong leaves an empty list (no access) plus `accessError` to explain it.
 */
const useSessionAccess = () => {
  const [auth, setAuth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });

  const userId = authUserId(auth);

  const query = useQuery({
    ...sessionAccessQuery(userId),
    enabled: !!userId,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setAuth(
        (current) => current && { ...current, ...toSessionAccess(query.data) },
      );
    }

    if (query.isError) {
      setAuth(
        (current) =>
          current && {
            ...current,
            effectivePermissions: [],
            accessError: query.error?.message || "Could not load your access.",
          },
      );
    }
  }, [query.isSuccess, query.isError, query.data, query.error, setAuth]);
};

export default useSessionAccess;
