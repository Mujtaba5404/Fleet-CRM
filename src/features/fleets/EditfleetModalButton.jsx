import { ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import EditfleetModal from "./EditfleetModal";

const EditfleetModalButton = ({ fleet }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    // <CanAccess resource="fleet" action="update">
    <>
      <EditfleetModal fleet={fleet} isOpen={opened} onClose={close} />

      <ActionIcon onClick={open}>
        <IconPencil size={18} />
      </ActionIcon>
      {/* </CanAccess> */}
    </>
  );
};

export default EditfleetModalButton;
