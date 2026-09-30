import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import DeleteItemButton from "./DeleteItemButton";

/**
 * View / edit / delete menu for a table row.
 *
 * All four tables had their own near-identical copy of this, and in every one
 * of them "Edit" called a handler whose modal was commented out — the item
 * looked live but did nothing. Wiring the edit drawer through
 * `renderEditModal` makes that impossible to repeat.
 *
 * @param {Object}   props
 * @param {string}   props.viewTo             Route for the detail screen.
 * @param {string}   props.label              Noun for the delete confirmation.
 * @param {string}   props.itemId
 * @param {Function} props.deleteMutationHook
 * @param {Function} props.renderEditModal    ({ opened, onClose }) => ReactNode
 */
const RecordRowMenu = ({
  viewTo,
  label,
  itemId,
  deleteMutationHook,
  renderEditModal,
}) => {
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  return (
    <>
      {renderEditModal?.({ opened: editOpened, onClose: closeEdit })}

      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon aria-label={`Actions for this ${label}`}>
            <IconDots size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            component={Link}
            to={viewTo}
            leftSection={<IconEye size={16} />}
          >
            View
          </Menu.Item>

          {renderEditModal && (
            <Menu.Item
              leftSection={<IconPencil size={16} />}
              onClick={openEdit}
            >
              Edit
            </Menu.Item>
          )}

          <Menu.Divider />

          <DeleteItemButton
            label={label}
            mutationHook={deleteMutationHook}
            itemId={itemId}
          >
            <Menu.Item color="red" leftSection={<IconTrash size={16} />}>
              Delete
            </Menu.Item>
          </DeleteItemButton>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default RecordRowMenu;
