import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "../api/index";

export const useGetAllPicklistsQuery = (params) => {
  return useQuery({
    queryKey: ["picklists", "all", params],
    queryFn: () =>
      api.get("picklists/all", { params }).then(({ data }) => data),
  });
};

export const useGetPicklistByIdQuery = (picklistId) => {
  return useQuery({
    queryKey: ["picklists", picklistId],
    queryFn: () => api.get(`picklists/${picklistId}`).then(({ data }) => data),
    enabled: !!picklistId,
  });
};

export const useCreatePicklistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("picklists", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["picklists"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("picklist successfully created"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error creating picklist"),
        type: "error",
      }),
  });
};

export const useUpdatePicklistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ picklistId, payload }) =>
      api.patch(`picklists/${picklistId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["picklists"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("picklist successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating picklist"),
        type: "error",
      }),
  });
};

export const useDeletePicklistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (picklistId) => api.delete(`picklists/${picklistId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["picklists"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("picklist successfully deleted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error deleting picklist"),
        type: "error",
      }),
  });
};
