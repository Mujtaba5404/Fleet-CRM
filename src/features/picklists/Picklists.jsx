import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import PICKLIST_SCOPE from "../../constants/PICKLIST_SCOPE";
import PicklistContext from "../../context/PicklistContext";
import AddPicklistModalButton from "./components/AddPicklistModalButton";
import PicklistModal from "./components/PicklistModal";
import PicklistsList from "./components/PicklistsList";

/**
 * Picklists Compound Component
 * @param {string} featureName - Friendly name for the picklist feature
 * @param {string} scope - Scope for the picklist
 * @param {string} resource - API resource name
 * @param {string} field - API field name
 * @param {React.ReactNode} children - Compound components (Modal, List, AddButton, etc.)
 */
const Picklists = ({
  featureName = "",
  scope = PICKLIST_SCOPE.RESOURCE,
  resource = "",
  field = "",
  children,
}) => {
  const [existingPicklist, setExistingPicklist] = useState(null);
  const [isOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const form = useForm({
    initialValues: {
      title: "",
      acronym: "",
      preserveTitleFormatting: false,
      color: "",
      isDefault: false,
      isActive: true,
      parentPicklist: undefined,
      meta: {},
    },
  });

  const openCreateModal = () => {
    setExistingPicklist(null);

    form.reset();

    openModal();
  };

  const openEditModal = (picklist) => {
    setExistingPicklist(picklist);

    form.setValues({
      title: picklist.title,
      acronym: picklist.acronym || "",
      preserveTitleFormatting: !!picklist.preserveTitleFormatting,
      color: picklist.color,
      isDefault: !!picklist.isDefault,
      isActive: !!picklist.isActive,
      parentPicklist: picklist?.parentPicklist?._id,
      meta: picklist.meta ?? {},
    });

    openModal();
  };

  return (
    <PicklistContext.Provider
      value={{
        featureName,
        scope,
        resource,
        field,
        form,
        isOpened,
        closeModal,
        openCreateModal,
        openEditModal,
        existingPicklist,
      }}
    >
      <Stack>{children}</Stack>
    </PicklistContext.Provider>
  );
};

Picklists.List = PicklistsList;
Picklists.Modal = PicklistModal;
Picklists.AddButton = AddPicklistModalButton;

export default Picklists;
