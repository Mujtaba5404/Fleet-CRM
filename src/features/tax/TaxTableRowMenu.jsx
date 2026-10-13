import { useDeleteTaxMutation } from "../../api/tax";
import RecordRowMenu from "../../components/RecordRowMenu";
import RESOURCES from "../../constants/RESOURCES";
import EditTaxModal from "./EditTaxModal";

const TaxTableRowMenu = ({ tax }) => (
  <RecordRowMenu
    resource={RESOURCES.TAXATION}
    viewTo={`/tax/${tax._id}`}
    label="challan"
    itemId={tax._id}
    deleteMutationHook={useDeleteTaxMutation}
    renderEditModal={({ opened, onClose }) => (
      <EditTaxModal tax={tax} isOpen={opened} onClose={onClose} />
    )}
  />
);

export default TaxTableRowMenu;
