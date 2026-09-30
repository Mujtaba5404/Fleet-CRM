import { TextInput } from "@mantine/core";
import { IconHash } from "@tabler/icons-react";

/**
 * Placeholder input for a reference to another collection (company, user,
 * fleet) that has no picker yet.
 *
 * These were plain TextInputs labelled "Company ID" with a "Company ObjectId"
 * placeholder, which read like an unfinished form. Presenting them as a
 * deliberate id field — monospace, hash affix, explicit hint — at least looks
 * intentional until the real Select lands. Swap this component out then and
 * every form picks up the picker at once.
 */
const ReferenceInput = ({ label, description, ...props }) => (
  <TextInput
    label={label}
    description={description}
    placeholder="Paste record id"
    leftSection={<IconHash size={15} />}
    leftSectionPointerEvents="none"
    styles={{
      input: {
        fontFamily: "var(--mantine-font-family-monospace)",
        fontSize: "var(--mantine-font-size-xs)",
      },
    }}
    {...props}
  />
);

export default ReferenceInput;
