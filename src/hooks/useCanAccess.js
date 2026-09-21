import { useLocalStorage } from "@mantine/hooks";
import { useMemo } from "react";

const normalize = (value) => (typeof value === "string" ? value.toLowerCase() : value);

const useCanAccess = (resources = "", actions = [], options = { resourcesMode: "any", actionsMode: "any" }) => {
  const [auth] = useLocalStorage({ key: "auth", getInitialValueInEffect: false });

  const permissionMap = useMemo(() => {
    if (!auth?.effectivePermissions?.length) {
      return new Map();
    }

    return new Map(auth.effectivePermissions.map((p) => [normalize(p.resource), new Set(p.actions.map(normalize))]));
  }, [auth?.effectivePermissions]);

  if (!permissionMap.size) {
    return false;
  }

  const requiredResources = Array.isArray(resources) ? resources.map(normalize) : [normalize(resources)];
  const requiredActions = Array.isArray(actions) ? actions.map(normalize) : [normalize(actions)];

  const checkActions = (permissionActionsSet) => {
    if (!permissionActionsSet?.size) return false;

    return options.actionsMode === "all" ? requiredActions.every((a) => permissionActionsSet.has(a)) : requiredActions.some((a) => permissionActionsSet.has(a));
  };

  const resourceResults = requiredResources.map((res) => {
    const permissionActionsSet = permissionMap.get(res);

    if (!permissionActionsSet) return false;

    return checkActions(permissionActionsSet);
  });

  return options.resourcesMode === "all" ? resourceResults.every(Boolean) : resourceResults.some(Boolean);
};

export default useCanAccess;
