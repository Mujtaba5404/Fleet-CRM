import { useDeletefleetMutation } from "../../api/fleet";
import DeleteItemButton from "../../components/DeleteItemButton";

const DeleteTaxButton = ({ insuranceId, redirect = false }) => {
  return (
    <DeleteItemButton
      label="insurance"
      mutationHook={useDeletefleetMutation}
      itemId={insuranceId}
      navigateTo={redirect ? "/insurance" : undefined}
    />
  );
};

export default DeleteTaxButton;
