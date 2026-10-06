import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

export const useGetAllRolesQuery = (params) => {
  return useQuery({
    queryKey: ["roles", "all", params],
    queryFn: () => api.get("roles/all", { params }).then(({ data }) => data),
  });
};

export const useGetRolesWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["roles", params],
    queryFn: () => api.get("roles", { params }).then(({ data }) => data),
  });
};

export const useGetRoleByIdQuery = (roleId) => {
  return useQuery({
    queryKey: ["roles", roleId],
    queryFn: () => api.get(`roles/${roleId}`).then(({ data }) => data),
    enabled: !!roleId,
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("roles", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("role successfully created"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error creating role"),
        type: "error",
      }),
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, payload }) => api.patch(`roles/${roleId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("role successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating role"),
        type: "error",
      }),
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId) => api.delete(`roles/${roleId}`),
    onSuccess: (_, roleId) => {
      // Skip the deleted record itself: refetching it from its own detail
      // screen would 404 in the moment before the redirect lands.
      queryClient.invalidateQueries({
        queryKey: ["roles"],
        predicate: (query) => query.queryKey[1] !== roleId,
      });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("role successfully deleted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error deleting role"),
        type: "error",
      }),
  });
};
