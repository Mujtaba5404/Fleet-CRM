import { upperFirst } from "@mantine/hooks";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

export const useGetAllDepreciationsQuery = (params) => {
  return useQuery({
    queryKey: ["depreciations", "all", params],
    queryFn: () =>
      api.get("depreciations/all", { params }).then(({ data }) => data),
  });
};

export const useGetDepreciationsWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["depreciations", "paginated", params],
    queryFn: () =>
      api.get("depreciations", { params }).then(({ data }) => data),
    placeholderData: keepPreviousData,
  });
};

export const useGetDepreciationByIdQuery = (depreciationId) => {
  return useQuery({
    queryKey: ["depreciations", "detail", depreciationId],
    queryFn: () =>
      api.get(`depreciations/${depreciationId}`).then(({ data }) => data),
    enabled: !!depreciationId,
  });
};

export const useCreateDepreciationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("depreciations", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depreciations"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("depreciation successfully created"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error creating depreciation"),
        type: "error",
      }),
  });
};

export const useUpdateDepreciationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ depreciationId, payload }) =>
      api.patch(`depreciations/${depreciationId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depreciations"] });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("depreciation successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating depreciation"),
        type: "error",
      }),
  });
};

export const useDeleteDepreciationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (depreciationId) =>
      api.delete(`depreciations/${depreciationId}`),
    onSuccess: (_, depreciationId) => {
      // Skip the deleted record itself: refetching it from its own detail
      // screen would 404 in the moment before the redirect lands.
      queryClient.invalidateQueries({
        queryKey: ["depreciations"],
        predicate: (query) => query.queryKey[2] !== depreciationId,
      });
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("depreciation successfully deleted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error deleting depreciation"),
        type: "error",
      }),
  });
};
