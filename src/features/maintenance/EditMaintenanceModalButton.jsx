import { ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import EditMaintenanceModal from "./EditMaintenanceModal";

const EditMaintenanceModalButton = ({ maintenance }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    // <CanAccess resource="maintenance" action="update">
    <>
      <EditMaintenanceModal maintenance={maintenance} isOpen={opened} onClose={close} />

      <ActionIcon onClick={open}>
        <IconPencil size={18} />
      </ActionIcon>
      {/* </CanAccess> */}
    </>
  );
};

export default EditMaintenanceModalButton;
