import { useDisclosure } from "@mantine/hooks";
import EditTrigger from "../../components/EditTrigger";
import EditfleetModal from "./EditfleetModal";

const EditfleetModalButton = ({ fleet, variant = "icon" }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <EditfleetModal fleet={fleet} isOpen={opened} onClose={close} />

      <EditTrigger onClick={open} variant={variant} label="Edit vehicle" />
    </>
  );
};

export default EditfleetModalButton;
