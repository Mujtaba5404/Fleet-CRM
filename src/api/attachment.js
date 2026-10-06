import { upperFirst } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "../notifications/showNotification";
import api from "./index";

export const useDeleteAttachmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId) => api.delete(`attachments/${attachmentId}`),
    onSuccess: () => {
      // Attachments are embedded in whichever record owns them (fleet, tax,
      // ...), so refetch everything rather than guess the owner.
      queryClient.invalidateQueries();
      showNotification({
        title: upperFirst("done!"),
        message: upperFirst("attachment successfully deleted"),
        type: "success",
      });
    },
    onError: (error) =>
      showNotification({
        title: upperFirst("error!"),
        message: upperFirst(error.message || "error deleting attachment"),
        type: "error",
      }),
  });
};
