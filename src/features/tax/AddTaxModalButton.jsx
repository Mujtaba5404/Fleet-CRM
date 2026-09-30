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
import AddTaxModal from "./AddTaxModal";

const AddTaxModalButton = () => {
  const [
    addmaintenanceModalOpened,
    { open: openAddmaintenanceModal, close: closeAddmaintenanceModal },
  ] = useDisclosure(false);

  return (
    <>
      <AddTaxModal
        isOpen={addmaintenanceModalOpened}
        onClose={closeAddmaintenanceModal}
      />

      <Button
        onClick={openAddmaintenanceModal}
        leftSection={<IconPlus size={18} />}
      >
        Add tax
      </Button>
    </>
  );
};

export default AddTaxModalButton;
