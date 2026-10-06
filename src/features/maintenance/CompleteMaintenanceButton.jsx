import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheck } from "@tabler/icons-react";
import EditMaintenanceModal from "./EditMaintenanceModal";
import { isCompleted } from "./maintenanceForm";

/** Opens the edit form pre-set to Completed, ready for the after photos. */
const CompleteMaintenanceButton = ({ maintenance }) => {
  const [opened, { open, close }] = useDisclosure(false);

  if (isCompleted(maintenance?.status)) return null;

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
