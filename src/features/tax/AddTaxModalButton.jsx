import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import RESOURCES from "../../constants/RESOURCES";
import AddTaxModal from "./AddTaxModal";

const AddTaxModalButton = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource={RESOURCES.TAXATION} action="create">
      <AddTaxModal isOpen={opened} onClose={close} />

      <Button onClick={open} leftSection={<IconPlus size={18} />}>
        Add tax
      </Button>
    </CanAccess>
  );
};

export default AddTaxModalButton;
