import { useMemo } from "react";
import { useGetAllRolesQuery, useGetRoleResourcesQuery } from "../../api/role";
import { buildCatalog } from "./roleForm";

/**
 * The resources a permission can be granted on: the API's own resource list
 * (falling back to the static catalog while it loads), widened by every
 * resource and field that any saved role already uses.
 *
 * @param {Object} [role] A role being viewed or edited, merged in too so its
 *   own grants are never hidden while the full list is still loading.
 */
const usePermissionCatalog = (role) => {
  const { data: roles } = useGetAllRolesQuery();
  const { data: resources } = useGetRoleResourcesQuery();

  return useMemo(
    () =>
      buildCatalog(
        [...(roles ?? []), ...(role ? [role] : [])],
        Array.isArray(resources) ? resources : [],
      ),
    [roles, role, resources],
  );
};

export default usePermissionCatalog;
