import { useDisclosure } from "@mantine/hooks";
import EditTrigger from "../../components/EditTrigger";
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

      <EditTrigger onClick={open} variant={variant} label="Edit policy" />
    </>
  );
};

export default EditInsuranceModalButton;
