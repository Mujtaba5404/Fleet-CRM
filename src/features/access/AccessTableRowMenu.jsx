import { ActionIcon, Menu, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { useDeleteAccessMutation } from "../../api/access";
import CanAccess from "../../components/CanAccess";
import DeleteItemButton from "../../components/DeleteItemButton";
import RESOURCES from "../../constants/RESOURCES";
import AccessFormDrawer from "./AccessFormDrawer";

/**
 * Edit / remove one user's access. The signed-in user's own record is locked,
 * so nobody can remove or downgrade themselves out of the screen they are on.
 */
const AccessTableRowMenu = ({ access, isSelf = false }) => {
  const [editOpened, { open, close }] = useDisclosure(false);

  if (isSelf) {
    return (
      <Tooltip label="You can't change your own access" withArrow>
        <ActionIcon
          variant="subtle"
          color="gray"
          disabled
          aria-label="Your own access cannot be changed"
        >
          <IconDots size={18} />
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <>
      <AccessFormDrawer access={access} isOpen={editOpened} onClose={close} />

      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon
            aria-label="Access actions"
            onClick={(event) => event.stopPropagation()}
          >
            <IconDots size={18} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <CanAccess resource={RESOURCES.ACCESS} action="update">
            <Menu.Item leftSection={<IconPencil size={16} />} onClick={open}>
              Change role
            </Menu.Item>
          </CanAccess>

          <CanAccess resource={RESOURCES.ACCESS} action="delete">
            <Menu.Divider />

            <DeleteItemButton
              resource={RESOURCES.ACCESS}
              label="access"
              mutationHook={useDeleteAccessMutation}
              itemId={access._id}
              confirmText="This user will lose every Fleet screen their role gave them, straight away. You can give them access again later."
            >
              <Menu.Item color="red" leftSection={<IconTrash size={16} />}>
                Remove access
              </Menu.Item>
            </DeleteItemButton>
          </CanAccess>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default AccessTableRowMenu;
