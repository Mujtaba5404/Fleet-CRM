import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useMemo } from "react";

const normalize = (value) =>
  typeof value === "string" ? value.toLowerCase() : value;

const DEFAULT_OPTIONS = { resourcesMode: "any", actionsMode: "any" };

/**
 * `effectivePermissions` from the login response → resource → Set(actions).
 * `null` when the session carries no permission list at all.
 */
export const buildPermissionMap = (effectivePermissions) =>
  Array.isArray(effectivePermissions)
    ? new Map(
        effectivePermissions.map((p) => [
          normalize(p.resource),
          new Set((p.actions ?? []).map(normalize)),
        ]),
      )
    : null;

/**
 * Whether the permission map grants `actions` on `resources`. Both may be a
 * single value or a list; `options` decide if any or all of them must match.
 *
 * No list yet means the session's permissions are still loading (see
 * useSessionAccess), so nothing is granted until they arrive.
 */
export const hasAccess = (
  permissionMap,
  resources = "",
  actions = [],
  options = DEFAULT_OPTIONS,
) => {
  if (!permissionMap?.size) return false;

  const requiredResources = [resources].flat().map(normalize);
  const requiredActions = [actions].flat().map(normalize);

  const checkActions = (granted) => {
    if (!granted?.size) return false;

    return options.actionsMode === "all"
      ? requiredActions.every((a) => granted.has(a))
      : requiredActions.some((a) => granted.has(a));
  };

  const results = requiredResources.map((res) =>
    checkActions(permissionMap.get(res)),
  );

  return options.resourcesMode === "all"
    ? results.every(Boolean)
    : results.some(Boolean);
};

/**
 * False until the session's permissions have loaded. Redirects wait for it, so
 * a page opened directly is not bounced away before access is known.
 */
export const usePermissionsLoaded = () => {
  const [auth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });

  return Array.isArray(auth?.effectivePermissions);
};

/** `can(resource, action)` for components that check several things. */
export const usePermissions = () => {
  const [auth] = useLocalStorage({
    key: "auth",
    getInitialValueInEffect: false,
  });

  const permissionMap = useMemo(
    () => buildPermissionMap(auth?.effectivePermissions),
    [auth?.effectivePermissions],
  );

  return useCallback(
    (resources, actions, options) =>
      hasAccess(permissionMap, resources, actions, options),
    [permissionMap],
  );
};

const useCanAccess = (
  resources = "",
  actions = [],
  options = DEFAULT_OPTIONS,
) => usePermissions()(resources, actions, options);

export default useCanAccess;
