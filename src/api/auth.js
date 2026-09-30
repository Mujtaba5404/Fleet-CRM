import { upperFirst } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "../api/index";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (payload) => api.post("auth/login", payload),
    onSuccess: () =>
      showNotification({
        title: upperFirst("successfully logged in!"),
        type: "success",
      }),
    onError: (error) =>
      showNotification({
        title: upperFirst(error.message || "error"),
        type: "error",
      }),
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => api.post("auth/logout"),
    onSuccess: () =>
      showNotification({
        title: upperFirst("successfully logged out!"),
        type: "success",
      }),
    onError: (error) =>
      showNotification({
        title: upperFirst(error.message || "error"),
        type: "error",
      }),
  });
};

export const useRefreshMutation = () => {
  return useQuery({
    queryFn: () => api.get("auth/refresh"),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload) => api.patch("auth/changePassword", payload),
    onSuccess: () =>
      showNotification({
        title: upperFirst("password successfully changed"),
        type: "success",
      }),
    onError: (error) =>
      showNotification({
        title: upperFirst(error.message || "error"),
        type: "error",
      }),
  });
};
