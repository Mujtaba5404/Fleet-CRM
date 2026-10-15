import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import CanAccess from "../../components/CanAccess";
import RESOURCES from "../../constants/RESOURCES";
import AddInsuranceModal from "./AddInsuranceModal";

const AddInsuranceModalButton = ({
  label = "Add insurance",
  fleet,
  ...buttonProps
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <CanAccess resource={RESOURCES.INSURANCE} action="create">
      <AddInsuranceModal isOpen={opened} onClose={close} fleet={fleet} />

      <Button
        onClick={open}
        leftSection={<IconPlus size={18} />}
        {...buttonProps}
      >
        {label}
      </Button>
    </CanAccess>
  );
};

export default AddInsuranceModalButton;
