import { useDisclosure } from "@mantine/hooks";
import EditTrigger from "../../components/EditTrigger";
import RESOURCES from "../../constants/RESOURCES";
import EditInsuranceModal from "./EditInsuranceModal";

const EditInsuranceModalButton = ({ insurance, variant = "icon" }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <EditInsuranceModal
        insurance={insurance}
        isOpen={opened}
        onClose={close}
      />

      <EditTrigger
        resource={RESOURCES.INSURANCE}
        onClick={open}
        variant={variant}
        label="Edit policy"
      />
    </>
  );
};

export default EditInsuranceModalButton;
