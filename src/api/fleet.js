import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

export const useGetAllfleetsQuery = (params) => {
  return useQuery({
    queryKey: ["fleets", "all", params],
    queryFn: () => api.get("fleets/all", { params }).then(({ data }) => data),
  });
};

export const useGetfleetsWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["fleets", params],
    queryFn: () => api.get("fleets", { params }).then(({ data }) => data),
  });
};

export const useGetfleetByIdQuery = (fleetId) => {
  return useQuery({
    queryKey: ["fleets", fleetId],
    queryFn: () => api.get(`fleets/${fleetId}`).then(({ data }) => data),
  });
};

export const useCreatefleetMutation = () => {
  const queryfleet = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("fleets", payload),
    onSuccess: () => {
      queryfleet.invalidateQueries(["fleets"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("fleet successfully created"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error creating fleet"),
        type: "error",
      }),
  });
};

export const useUpdatefleetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fleetId, payload }) =>
      api.patch(`fleets/${fleetId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["fleets"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("fleet successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating fleet"),
        type: "error",
      }),
  });
};

export const useDeletefleetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fleetId) => api.delete(`fleets/${fleetId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["fleets"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("fleet successfully deleted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error deleting fleet"),
        type: "error",
      }),
  });
};
