import { useDisclosure } from "@mantine/hooks";
import EditTrigger from "../../components/EditTrigger";
import RESOURCES from "../../constants/RESOURCES";
import EditDepreciationModal from "./EditDepreciationModal";

const EditDepreciationModalButton = ({ depreciation, variant = "icon" }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <EditDepreciationModal
        depreciation={depreciation}
        isOpen={opened}
        onClose={close}
      />

      <EditTrigger
        resource={RESOURCES.DEPRECIATION}
        onClick={open}
        variant={variant}
        label="Edit depreciation"
      />
    </>
  );
};

export default EditDepreciationModalButton;
