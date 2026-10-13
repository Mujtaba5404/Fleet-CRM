import { upperFirst } from "@mantine/hooks";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

const toList = (data) => (Array.isArray(data) ? data : (data?.data ?? []));

export const idOf = (value) => value?._id ?? value;

export const authUserId = (auth) =>
  auth?.id ?? auth?._id ?? auth?.user?._id ?? null;

export const useGetAllAccessQuery = (params) => {
  return useQuery({
    queryKey: ["access", "all", params],
    queryFn: () =>
      api.get("access/all", { params }).then(({ data }) => toList(data)),
  });
};

export const useGetAccessWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["access", "paginated", params],
    queryFn: () => api.get("access", { params }).then(({ data }) => data),
    placeholderData: keepPreviousData,
  });
};

export const useGetAccessByIdQuery = (accessId) => {
  return useQuery({
    queryKey: ["access", "detail", accessId],
    queryFn: () => api.get(`access/${accessId}`).then(({ data }) => data),
    enabled: !!accessId,
  });
};

/** Central users that can be given a Fleet role. */
export const useGetAccessUsersQuery = (params) => {
  return useQuery({
    queryKey: ["access", "users", params],
    queryFn: () =>
      api.get("access/users", { params }).then(({ data }) => toList(data)),
  });
};

/** The signed-in user's Access record from the full list, or null when they have none. */
export const fetchMyAccess = async (userId) => {
  const { data } = await api.get("access/all");

  return toList(data).find((access) => idOf(access.user) === userId) ?? null;
};

/** Every role's permissions on one resource, merged into one grant. */
export const mergeRolePermissions = (roles = []) => {
  const byResource = new Map();

  roles.forEach((role) =>
    role?.permissions?.forEach(({ resource, actions = [] }) => {
      if (!resource) return;

      const granted = byResource.get(resource) ?? new Set();
      actions.forEach((action) => granted.add(action));
      byResource.set(resource, granted);
    }),
  );

  return [...byResource].map(([resource, actions]) => ({
    resource,
    actions: [...actions],
  }));
};

export const useCreateAccessMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("access", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("access successfully granted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error granting access"),
        type: "error",
      }),
  });
};

export const useUpdateAccessMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accessId, payload }) =>
      api.patch(`access/${accessId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("access successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating access"),
        type: "error",
      }),
  });
};

export const useDeleteAccessMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accessId) => api.delete(`access/${accessId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("access successfully removed"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error removing access"),
        type: "error",
      }),
  });
};
