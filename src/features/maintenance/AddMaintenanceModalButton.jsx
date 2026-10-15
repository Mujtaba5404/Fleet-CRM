import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import RESOURCES from "../../constants/RESOURCES";
import AddMaintenanceModal from "./AddMaintenanceModal";

const AddMaintenanceModalButton = ({
  label = "Add maintenance",
  fleet,
  ...buttonProps
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource={RESOURCES.MAINTENANCE} action="create">
      <AddMaintenanceModal isOpen={opened} onClose={close} fleet={fleet} />

      <Button
        onClick={open}
        leftSection={<IconPlus size={18} />}
        {...buttonProps}
      >
        {label}
      </Button>
    </CanAccess>
  );
};

export default AddMaintenanceModalButton;
