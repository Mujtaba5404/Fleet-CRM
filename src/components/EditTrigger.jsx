import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import useCanAccess from "../hooks/useCanAccess";

/**
 * The "edit this record" control. Renders only for roles with `update` on
 * `resource`.
 *
 * `variant="button"` is for a page header, where a lone pencil icon next to a
 * lone bin icon gives no hint about what either does; `variant="icon"` is for
 * tight spots like a table row.
 */
const EditTrigger = ({
  resource,
  onClick,
  variant = "icon",
  label = "Edit",
}) => {
  const canUpdate = useCanAccess(resource, "update");

  if (!canUpdate) return null;

  return variant === "button" ? (
    <Button
      variant="default"
      onClick={onClick}
      leftSection={<IconPencil size={16} />}
    >
      {label}
    </Button>
  ) : (
    <Tooltip label={label} withArrow>
      <ActionIcon onClick={onClick} aria-label={label}>
        <IconPencil size={18} />
      </ActionIcon>
    </Tooltip>
  );
};

export default EditTrigger;
