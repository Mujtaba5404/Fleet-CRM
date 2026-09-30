import { useDisclosure } from "@mantine/hooks";
import EditTrigger from "../../components/EditTrigger";
import EditMaintenanceModal from "./EditMaintenanceModal";

const EditMaintenanceModalButton = ({ maintenance, variant = "icon" }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <EditMaintenanceModal
        maintenance={maintenance}
        isOpen={opened}
        onClose={close}
      />

      <EditTrigger onClick={open} variant={variant} label="Edit job" />
    </>
  );
};

export default EditMaintenanceModalButton;
