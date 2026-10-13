import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import RESOURCES from "../../constants/RESOURCES";
import AddfleetModal from "./AddfleetModal";

const AddfleetModalButton = () => {
  const [
    addfleetModalOpened,
    { open: openAddfleetModal, close: closeAddfleetModal },
  ] = useDisclosure(false);

  return (
    <CanAccess resource={RESOURCES.FLEET} action="create">
      <AddfleetModal
        isOpen={addfleetModalOpened}
        onClose={closeAddfleetModal}
      />

      <Button onClick={openAddfleetModal} leftSection={<IconPlus size={18} />}>
        Add fleet
      </Button>
    </CanAccess>
  );
};

export default AddfleetModalButton;
