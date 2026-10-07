import { upperFirst } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import { authApi } from "./index";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (payload) => authApi.post("auth/login", payload),
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
    mutationFn: () => authApi.post("auth/logout"),
    onError: (error) =>
      showNotification({
        title: upperFirst(error.message || "error"),
        type: "error",
      }),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload) => authApi.patch("auth/changePassword", payload),
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
