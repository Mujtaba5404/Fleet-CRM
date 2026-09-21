// import { Button } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { IconPlus } from "@tabler/icons-react";
// import CanAccess from "../../components/CanAccess";
// import AddfleetModal from "./AddfleetModal";

// const AddfleetModalButton = () => {
//   const [addfleetModalOpened, { open: openAddfleetModal, close: closeAddfleetModal }] = useDisclosure(false);

//   return (
//     <CanAccess resource="fleet" action="create">
//       <AddfleetModal isOpen={addfleetModalOpened} onClose={closeAddfleetModal} />

//       <Button onClick={openAddfleetModal} leftSection={<IconPlus size={18} />}>
//         Add fleet
//       </Button>
//     </CanAccess>
//   );
// };

// export default AddfleetModalButton;
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import AddfleetModal from "./AddfleetModal";

const AddfleetModalButton = () => {
  const [
    addfleetModalOpened,
    { open: openAddfleetModal, close: closeAddfleetModal },
  ] = useDisclosure(false);

  return (
    <>
      <AddfleetModal
        isOpen={addfleetModalOpened}
        onClose={closeAddfleetModal}
      />

      <Button onClick={openAddfleetModal} leftSection={<IconPlus size={18} />}>
        Add fleet
      </Button>
    </>
  );
};

export default AddfleetModalButton;
