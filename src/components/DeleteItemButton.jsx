import { ActionIcon, Button, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import capitalizeLetters from "../utils/capitalizeLetters";

/**
 * Generic delete control with a confirmation step.
 *
 * Handles:
 * - Confirmation modal before deletion
 * - React Query mutation hook
 * - Single or multiple deletion
 * - Button, icon, or caller-supplied trigger
 * - Optional redirect once the delete actually succeeds
 *
 * @param {Object} props
 * @param {string} [props.resource] - Reserved for the CanAccess guard, which
 *   is not applied yet (permissions are not populated in every deployment).
 * @param {string} props.label - Human-readable noun for the modal and button
 *   text (e.g. "policy")
 * @param {string|number|Array} props.itemId - The id(s) to delete
 * @param {Function} props.mutationHook - React Query mutation hook
 * @param {string} [props.confirmText] - Optional confirmation modal text
 * @param {'button'|'icon'} [props.variant] - Render as button or icon (default: "icon")
 * @param {Function} [props.onSuccess] - Callback after successful deletion
 * @param {string} [props.navigateTo] - Route to go to after a successful delete
 * @param {boolean} [props.disabled] - Disable the trigger
 * @param {Object} [props.tooltip] - Optional tooltip props { label, withArrow }
 * @param {string} [props.buttonText] - Custom button text (for variant="button")
 * @param {React.ReactNode} [props.children] - Custom trigger element
 */
const DeleteItemButton = ({
  label,
  itemId,
  mutationHook,
  confirmText,
  variant = "icon",
  onSuccess = () => {},
  navigateTo,
  disabled = false,
  tooltip,
  buttonText,
  children,
}) => {
  const deleteMutation = mutationHook();
  const navigate = useNavigate();

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: capitalizeLetters(`Delete ${label}`),
      centered: true,
      children: (
        <Text size="sm">
          {confirmText ||
            `Are you sure you want to delete this ${label}? This cannot be undone.`}
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        // mutateAsync, not mutate: mutate() returns undefined, so the previous
        // `await` resolved immediately and redirected before the request had
        // finished — and a failed delete still navigated away.
        try {
          await deleteMutation.mutateAsync(itemId);

          onSuccess();

          if (navigateTo) navigate(navigateTo);
        } catch {
          // The mutation hook already reports the failure via a notification.
        }
      },
    });
  };

  const buttonProps = {
    color: "red",
    onClick: openDeleteModal,
    loading: deleteMutation.isPending,
    disabled,
  };

  let content;

  if (children) {
    content = React.cloneElement(children, {
      onClick: (event) => {
        event.stopPropagation();
        openDeleteModal();
      },
      disabled,
    });
  } else if (variant === "button") {
    content = (
      <Button {...buttonProps}>
        {buttonText ||
          `Delete ${Array.isArray(itemId) ? itemId.length : ""} ${label}`}
      </Button>
    );
  } else {
    content = (
      <ActionIcon
        variant="subtle"
        aria-label={`Delete ${label}`}
        {...buttonProps}
      >
        <IconTrash size={18} />
      </ActionIcon>
    );
  }

  return tooltip ? <Tooltip {...tooltip}>{content}</Tooltip> : content;
};

export default DeleteItemButton;
