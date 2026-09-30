import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

export const useGetAllInsuranceQuery = (params) => {
  return useQuery({
    queryKey: ["insurance", "all", params],
    queryFn: () =>
      api.get("insurance/all", { params }).then(({ data }) => data),
  });
};

export const useGetInsuranceWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["insurance", params],
    queryFn: () => api.get("insurance", { params }).then(({ data }) => data),
  });
};

export const useGetInsuranceByIdQuery = (insuranceId) => {
  return useQuery({
    queryKey: ["insurance", insuranceId],
    queryFn: () => api.get(`insurance/${insuranceId}`).then(({ data }) => data),
  });
};

export const useCreateInsuranceMutation = () => {
  const queryfleet = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("insurance", payload),
    onSuccess: () => {
      queryfleet.invalidateQueries(["insurance"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("insurance successfully created"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error creating insurance"),
        type: "error",
      }),
  });
};

export const useUpdateInsuranceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ insuranceId, payload }) =>
      api.patch(`insurance/${insuranceId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["insurance"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("insurance successfully updated"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error updating insurance"),
        type: "error",
      }),
  });
};

export const useDeleteInsuranceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (insuranceId) => api.delete(`insurance/${insuranceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["insurance"]);
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("insurance successfully deleted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error deleting insurance"),
        type: "error",
      }),
  });
};
