import { Text } from "@mantine/core";
import formatDate from "../utils/formatDate";

/**
 * Bookkeeping about a record, kept quiet at the bottom of the properties
 * card instead of taking a card of its own.
 */
const RecordMeta = ({ createdAt, updatedAt, company }) => {
  const companyTitle = typeof company === "object" ? company?.title : null;

  const parts = [
    companyTitle,
    createdAt && `Created ${formatDate(createdAt)}`,
    updatedAt && `Updated ${formatDate(updatedAt)}`,
  ].filter(Boolean);

  return (
    <Text fz="xs" c="dimmed">
      {parts.join(" · ")}
    </Text>
  );
};

export default RecordMeta;
