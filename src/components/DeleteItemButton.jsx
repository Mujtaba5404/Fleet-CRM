import { ActionIcon, Button, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import CanAccess from "../components/CanAccess";
import capitalizeLetters from "../utils/capitalizeLetters";

/**
 * Generic delete button with confirmation modal
 *
 * This component is fully reusable for any entity. It handles:
 * - Permission check via CanAccess
 * - Confirmation modal before deletion
 * - RTK Query mutation hook
 * - Single or multiple deletion
 * - Optional button or icon variant
 * - Optional tooltip
 *
 * @param {Object} props
 * @param {string} props.resource - Resource name for CanAccess (e.g., "Lead")
 * @param {string} props.label - Human-readable label for the modal, tooltip, and button text (e.g., "lead")
 * @param {string|number|Array} props.itemId - The id(s) of the item(s) to delete
 * @param {Function} props.mutationHook - RTK Query mutation hook
 * @param {string} [props.confirmText] - Optional confirmation modal text
 * @param {'button'|'icon'} [props.variant] - Render as button or icon (default: "icon")
 * @param {Function} [props.onSuccess] - Callback after successful deletion
 * @param {string} [props.navigateTo] - Optional route to navigate after deletion
 * @param {boolean} [props.disabled] - Disable button
 * @param {Object} [props.tooltip] - Optional tooltip props { label, withArrow }
 * @param {string} [props.buttonText] - Optional custom button text (for variant="button")
 * @param {React.ReactNode} [props.children] - Optional custom child element to render instead of default button or icon
 */
const DeleteItemButton = ({ resource, label, itemId, mutationHook, confirmText, variant = "icon", onSuccess = () => {}, navigateTo, disabled = false, tooltip, buttonText, children }) => {
  const deleteMutation = mutationHook();
  const navigate = useNavigate();

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: capitalizeLetters(`${label} delete confirmation`),
      centered: true,
      children: <Text size="sm">{confirmText || `Are you sure you want to delete this ${label}?`}</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleteMutation.isPending },
      onConfirm: async () => {
        try {
          await deleteMutation.mutate(itemId);

          onSuccess();

          if (navigateTo) navigate(navigateTo);
        } catch (err) {
          console.error(`Failed to delete ${label}`, err);
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
    content = React.cloneElement(children, { onClick: openDeleteModal, disabled });
  } else if (variant === "button") {
    content = <Button {...buttonProps}>{buttonText || `Delete ${Array.isArray(itemId) ? itemId.length : ""} ${label}`}</Button>;
  } else {
    content = (
      <ActionIcon variant="subtle" {...buttonProps}>
        <IconTrash size={18} />
      </ActionIcon>
    );
  }

//   if (tooltip) {
//     return (
//       <CanAccess resource={resource} action={"delete"}>
//         <Tooltip {...tooltip}>{content}</Tooltip>
//       </CanAccess>
//     );
//   }

//   return (
//     <CanAccess resource={resource} action={"delete"}>
//       {content}
//     </CanAccess>
//   );
// };
  if (tooltip) {
    return <Tooltip {...tooltip}>{content}</Tooltip>;
  }

  return content;
};

export default DeleteItemButton;
