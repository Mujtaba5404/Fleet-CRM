import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import AddRoleModal from "./AddRoleModal";

const AddRoleModalButton = ({ label = "Add role", ...buttonProps }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <AddRoleModal isOpen={opened} onClose={close} />

      <Button
        onClick={open}
        leftSection={<IconPlus size={18} />}
        {...buttonProps}
      >
        {label}
      </Button>
    </>
  );
};

export default AddRoleModalButton;
