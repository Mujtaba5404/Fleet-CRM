import { ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import EditInsuranceModal from "./EditInsuranceModal";

const EditInsuranceModalButton = ({ insurance }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    // <CanAccess resource="insurance" action="update">
    <>
      <EditInsuranceModal insurance={insurance} isOpen={opened} onClose={close} />

      <ActionIcon onClick={open}>
        <IconPencil size={18} />
      </ActionIcon>
      {/* </CanAccess> */}
    </>
  );
};

export default EditInsuranceModalButton;
