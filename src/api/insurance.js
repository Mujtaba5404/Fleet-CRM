import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

/*
 * The API sends a policy's provider as a bare picklist id. Records are given
 * the full picklist ({ _id, title, color }) here, so every screen can show
 * the provider's name. The query key matches the provider dropdown's, so both
 * share one cached request.
 */
const PROVIDER_PARAMS = { query: { resource: "Insurance", field: "provider" } };

const fetchProviders = (queryClient) =>
  queryClient
    .fetchQuery({
      queryKey: ["picklists", "all", PROVIDER_PARAMS],
      queryFn: () =>
        api
          .get("picklists/all", { params: PROVIDER_PARAMS })
          .then(({ data }) => data),
      staleTime: 60_000,
    })
    // Without provider names the policies are still worth showing.
    .catch(() => []);

const withProvider = (providers) => (record) =>
  record && typeof record.provider === "string"
    ? {
        ...record,
        provider:
          providers.find((item) => item._id === record.provider) ??
          record.provider,
      }
    : record;

/** Bare arrays (`/all`) and paginated `{ data, meta }` responses alike. */
const withProviders = async (queryClient, data) => {
  const attach = withProvider(await fetchProviders(queryClient));

  return Array.isArray(data)
    ? data.map(attach)
    : { ...data, data: (data?.data ?? []).map(attach) };
};

export const useGetAllInsuranceQuery = (params) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["insurance", "all", params],
    queryFn: () =>
      api
        .get("insurance/all", { params })
        .then(({ data }) => withProviders(queryClient, data)),
  });
};

export const useGetInsuranceWithPaginationQuery = (params) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["insurance", params],
    queryFn: () =>
      api
        .get("insurance", { params })
        .then(({ data }) => withProviders(queryClient, data)),
  });
};

export const useGetInsuranceByIdQuery = (insuranceId) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["insurance", insuranceId],
    queryFn: () =>
      api
        .get(`insurance/${insuranceId}`)
        .then(async ({ data }) =>
          withProvider(await fetchProviders(queryClient))(data),
        ),
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
