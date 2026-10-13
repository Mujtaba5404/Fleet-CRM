import { ActionIcon } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import CanAccess from "../../../components/CanAccess";
import RESOURCES from "../../../constants/RESOURCES";
import { usePicklists } from "../../../context/PicklistContext";

const EditPicklistModalButton = ({ picklist }) => {
  const { openEditModal } = usePicklists();

  return (
    <CanAccess resource={RESOURCES.PICKLIST} action="update">
      <ActionIcon onClick={() => openEditModal(picklist)}>
        <IconPencil size={18} />
      </ActionIcon>
    </CanAccess>
  );
};

export default EditPicklistModalButton;
