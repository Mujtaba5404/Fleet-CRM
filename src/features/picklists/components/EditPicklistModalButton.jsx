// import { ActionIcon } from "@mantine/core";
// import { IconPencil } from "@tabler/icons-react";
// import CanAccess from "../../../components/CanAccess";
// import PICKLIST_SCOPE from "../../../constants/PICKLIST_SCOPE";
// import { usePicklists } from "../../../context/PicklistContext";

// const EditPicklistModalButton = ({ picklist }) => {
//   const { scope, resource, openEditModal } = usePicklists();

//   return (
//     <CanAccess resource={scope === PICKLIST_SCOPE.RESOURCE ? resource : "picklist"} action="update">
//       <ActionIcon onClick={() => openEditModal(picklist)}>
//         <IconPencil size={18} />
//       </ActionIcon>
//     </CanAccess>
//   );
// };

// export default EditPicklistModalButton;
import { ActionIcon } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { usePicklists } from "../../../context/PicklistContext";

const EditPicklistModalButton = ({ picklist }) => {
  const { openEditModal } = usePicklists();

  return (
    <ActionIcon onClick={() => openEditModal(picklist)}>
      <IconPencil size={18} />
    </ActionIcon>
  );
};

export default EditPicklistModalButton;
