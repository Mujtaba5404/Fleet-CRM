import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

export const useGetAllMaintenanceQuery = (params) => {
  return useQuery({
    queryKey: ["maintenance", "all", params],
    queryFn: () => api.get("maintenance/all", { params }).then(({ data }) => data),
  });
};

export const useGetMaintenanceWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["maintenance", params],
    queryFn: () => api.get("maintenance", { params }).then(({ data }) => data),
  });
};

export const useGetMaintenanceByIdQuery = (maintenanceId) => {
  return useQuery({
    queryKey: ["maintenance", maintenanceId],
    queryFn: () => api.get(`maintenance/${maintenanceId}`).then(({ data }) => data),
  });
};

export const useCreateMaintenanceMutation = () => {
  const queryfleet = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("maintenance", payload),
    onSuccess: () => {
      queryfleet.invalidateQueries(["maintenance"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("maintenance successfully created"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error creating maintenance"),
        type: "error",
      }),
  });
};

export const useUpdateMaintenanceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ maintenanceId, payload }) =>
      api.patch(`maintenance/${maintenanceId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["maintenance"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("maintenance successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating maintenance"),
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
