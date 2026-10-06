import { useMemo } from "react";
import { useGetAllRolesQuery } from "../../api/role";
import { buildCatalog } from "./roleForm";

/**
 * The resources a permission can be granted on: the static catalog, widened by
 * every resource and field that any saved role already uses.
 *
 * @param {Object} [role] A role being viewed or edited, merged in too so its
 *   own grants are never hidden while the full list is still loading.
 */
const usePermissionCatalog = (role) => {
  const { data: roles } = useGetAllRolesQuery();

  return useMemo(
    () => buildCatalog([...(roles ?? []), ...(role ? [role] : [])]),
    [roles, role],
  );
};

export default usePermissionCatalog;
