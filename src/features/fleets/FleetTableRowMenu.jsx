import { ActionIcon, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDots,
  IconEye,
  IconMessagePlus,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import CanAccess from "../../components/CanAccess";
import DeleteItemButton from "../../components/DeleteItemButton";
import { useDeletefleetMutation } from "../../api/fleet";

const FleetTableRowMenu = ({ fleet, compact = false }) => {
  const [
    addCommentModalOpened,
    { open: openAddCommentModal, close: closeAddCommentModal },
  ] = useDisclosure(false);
  const [
    editClientModalOpened,
    { open: openEditClientModal, close: closeEditClientModal },
  ] = useDisclosure(false);

  return (
    <>
      {/* <AddCommentModal isOpen={addCommentModalOpened} onClose={closeAddCommentModal} resource={"Client"} resourceId={client._id} />
      <EditClientModal isOpen={editClientModalOpened} onClose={closeEditClientModal} client={client} compact={compact} /> */}

      <Menu position="bottom-end">
        <Menu.Target>
          <ActionIcon>
            <IconDots size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          {/* <CanAccess resource="fleets" action="read"> */}
          <Menu.Item
            component={Link}
            to={`/fleets/${fleet._id}`}
            leftSection={<IconEye size={18} />}
          >
            View
          </Menu.Item>
          {/* </CanAccess> */}

          {/* <CanAccess resource="fleets" action="update"> */}
          <Menu.Item
            leftSection={<IconPencil size={18} />}
            onClick={openEditClientModal}
          >
            Edit
          </Menu.Item>
          {/* </CanAccess> */}

          <Menu.Divider />

          <DeleteItemButton
            label="fleets"
            mutationHook={useDeletefleetMutation}
            itemId={fleet._id}
          >
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={18} />}
              onClick={(e) => e.stopPropagation()}
            >
              Delete
            </Menu.Item>
          </DeleteItemButton>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default FleetTableRowMenu;
