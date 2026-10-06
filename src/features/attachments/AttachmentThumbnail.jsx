import { Avatar, Box } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { SERVER_URL } from "src/constants/SERVER_URL";
import DeleteAttachmentButton from "./DeleteAttachmentButton";

const AttachmentThumbnail = ({ attachment, ...props }) => {
  return (
    <Box style={{ position: "relative" }}>
      <Avatar src={`${SERVER_URL}${attachment?.filePath || ""}`} alt={attachment.originalName} title={attachment.originalName} size={"lg"} {...props}>
        <IconPhoto />
      </Avatar>

      <Box style={{ position: "absolute", top: 0, left: 0 }}>
        <DeleteAttachmentButton attachmentId={attachment._id} />
      </Box>
    </Box>
  );
};

export default AttachmentThumbnail;
