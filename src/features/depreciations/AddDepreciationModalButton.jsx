import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import RESOURCES from "../../constants/RESOURCES";
import AddDepreciationModal from "./AddDepreciationModal";

const AddDepreciationModalButton = ({
  label = "Add depreciation",
  fleetId,
  ...buttonProps
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource={RESOURCES.DEPRECIATION} action="create">
      <AddDepreciationModal isOpen={opened} onClose={close} fleetId={fleetId} />

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

export default AddDepreciationModalButton;
