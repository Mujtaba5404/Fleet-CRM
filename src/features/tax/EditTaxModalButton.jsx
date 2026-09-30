import { useDisclosure } from "@mantine/hooks";
import EditTrigger from "../../components/EditTrigger";
import EditTaxModal from "./EditTaxModal";

const EditTaxModalButton = ({ tax, variant = "icon" }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <EditTaxModal tax={tax} isOpen={opened} onClose={close} />

      <EditTrigger onClick={open} variant={variant} label="Edit challan" />
    </>
  );
};

export default EditTaxModalButton;
