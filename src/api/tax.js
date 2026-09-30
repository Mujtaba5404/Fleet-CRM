import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

export const useGetAllTaxQuery = (params) => {
  return useQuery({
    queryKey: ["taxation", "all", params],
    queryFn: () => api.get("taxation/all", { params }).then(({ data }) => data),
  });
};

export const useGetTaxWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["taxation", params],
    queryFn: () => api.get("taxation", { params }).then(({ data }) => data),
  });
};

export const useGetTaxByIdQuery = (taxationId) => {
  return useQuery({
    queryKey: ["taxation", taxationId],
    queryFn: () => api.get(`taxation/${taxationId}`).then(({ data }) => data),
  });
};

export const useCreateTaxMutation = () => {
  const queryfleet = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("taxation", payload),
    onSuccess: () => {
      queryfleet.invalidateQueries(["taxation"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("taxation successfully created"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error creating taxation"),
        type: "error",
      }),
  });
};

export const useUpdateTaxMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taxationId, payload }) =>
      api.patch(`taxation/${taxationId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["taxation"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("taxation successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating taxation"),
        type: "error",
      }),
  });
};

export const useDeleteTaxMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taxationId) => api.delete(`taxation/${taxationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["taxation"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("taxation successfully deleted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error deleting taxation"),
        type: "error",
      }),
  });
};
