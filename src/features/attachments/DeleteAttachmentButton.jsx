import { useDeleteAttachmentMutation } from "src/api/attachment";
import DeleteItemButton from "src/components/DeleteItemButton";

const DeleteAttachmentButton = ({ attachmentId }) => {
  return <DeleteItemButton resource="attachment" label="attachment" mutationHook={useDeleteAttachmentMutation} itemId={attachmentId} />;
};

export default DeleteAttachmentButton;
