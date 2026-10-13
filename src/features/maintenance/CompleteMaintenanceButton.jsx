import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheck } from "@tabler/icons-react";
import RESOURCES from "../../constants/RESOURCES";
import useCanAccess from "../../hooks/useCanAccess";
import EditMaintenanceModal from "./EditMaintenanceModal";
import { isCompleted } from "./maintenanceForm";

/** Opens the edit form pre-set to Completed, ready for the after photos. */
const CompleteMaintenanceButton = ({ maintenance }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const canUpdate = useCanAccess(RESOURCES.MAINTENANCE, "update");

  if (!canUpdate || isCompleted(maintenance?.status)) return null;

  return (
    <>
      <EditMaintenanceModal
        maintenance={maintenance}
        isOpen={opened}
        onClose={close}
        completing
      />

      <Button
        color="teal"
        onClick={open}
        leftSection={<IconCircleCheck size={18} />}
      >
        Mark completed
      </Button>
    </>
  );
};

export default CompleteMaintenanceButton;
