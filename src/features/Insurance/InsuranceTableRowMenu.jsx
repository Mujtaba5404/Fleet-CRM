import { useDeleteInsuranceMutation } from "../../api/insurance";
import RecordRowMenu from "../../components/RecordRowMenu";
import EditInsuranceModal from "./EditInsuranceModal";

const InsuranceTableRowMenu = ({ insurance }) => (
  <RecordRowMenu
    viewTo={`/insurance/${insurance._id}`}
    label="policy"
    itemId={insurance._id}
    deleteMutationHook={useDeleteInsuranceMutation}
    renderEditModal={({ opened, onClose }) => (
      <EditInsuranceModal
        insurance={insurance}
        isOpen={opened}
        onClose={onClose}
      />
    )}
  />
);

export default InsuranceTableRowMenu;
