import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

/*
 * The API keeps the tax period as plain years (`startDate: 2025`) and the
 * amount as `amount`. The UI works with dates and `taxAmount`, so records are
 * translated here, on the way in and on the way out, and nowhere else.
 */

const toYear = (value) => {
  if (value == null || value === "") return value;
  if (typeof value === "number") return value;

  // dayjs reads "2025-01-01" as local time; `new Date` would read it as UTC.
  return dayjs(value).year();
};

/** 2025 → 1 Jan 2025 00:00 (start) or 31 Dec 2025 23:59 (end), local time. */
const fromYear = (value, end = false) =>
  typeof value === "number"
    ? (end
        ? new Date(value, 11, 31, 23, 59, 59, 999)
        : new Date(value, 0, 1)
      ).toISOString()
    : value;

const fromApi = (record) =>
  record && typeof record === "object"
    ? {
        ...record,
        startDate: fromYear(record.startDate),
        endDate: fromYear(record.endDate, true),
        taxAmount: record.taxAmount ?? record.amount,
      }
    : record;

const toApi = ({ taxAmount, startDate, endDate, ...payload }) => ({
  ...payload,
  ...(startDate !== undefined && { startDate: toYear(startDate) }),
  ...(endDate !== undefined && { endDate: toYear(endDate) }),
  ...(taxAmount !== undefined && { amount: taxAmount }),
});

/** Bare arrays (`/all`) and paginated `{ data, meta }` responses alike. */
const fromApiList = (data) =>
  Array.isArray(data)
    ? data.map(fromApi)
    : { ...data, data: (data?.data ?? []).map(fromApi) };

export const useGetAllTaxQuery = (params) => {
  return useQuery({
    queryKey: ["taxation", "all", params],
    queryFn: () =>
      api.get("taxation/all", { params }).then(({ data }) => fromApiList(data)),
  });
};

export const useGetTaxWithPaginationQuery = (params) => {
  return useQuery({
    queryKey: ["taxation", params],
    queryFn: () =>
      api.get("taxation", { params }).then(({ data }) => fromApiList(data)),
  });
};

export const useGetTaxByIdQuery = (taxationId) => {
  return useQuery({
    queryKey: ["taxation", taxationId],
    queryFn: () =>
      api.get(`taxation/${taxationId}`).then(({ data }) => fromApi(data)),
  });
};

export const useCreateTaxMutation = () => {
  const queryfleet = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post("taxation", toApi(payload)),
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
      api.patch(`taxation/${taxationId}`, toApi(payload)),
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
