import { useDisclosure } from "@mantine/hooks";
import EditTrigger from "../../components/EditTrigger";
import EditRoleModal from "./EditRoleModal";

const EditRoleModalButton = ({ role, variant = "icon" }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <EditRoleModal role={role} isOpen={opened} onClose={close} />

      <EditTrigger onClick={open} variant={variant} label="Edit role" />
    </>
  );
};

export default EditRoleModalButton;
