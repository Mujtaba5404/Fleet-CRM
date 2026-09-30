import { CloseButton, TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";

/**
 * Search box that keeps typing snappy while only pushing the value (into the
 * URL, via the caller's `onChange`) once the user pauses.
 */
const SearchInput = ({
  value = "",
  onChange,
  placeholder = "Search…",
  delay = 350,
  ...props
}) => {
  const [draft, setDraft] = useState(value);
  const [lastValue, setLastValue] = useState(value);

  // Adjust during render rather than in an effect: when the value changes from
  // outside (clear all, back button) the input catches up without an extra
  // render pass. Our own debounced push lands here too, but as a no-op.
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(value ?? "");
  }

  const push = useDebouncedCallback((next) => onChange(next), delay);

  const handleChange = (next) => {
    setDraft(next);
    push(next);
  };

  return (
    <TextInput
      value={draft}
      onChange={(event) => handleChange(event.currentTarget.value)}
      placeholder={placeholder}
      leftSection={<IconSearch size={16} />}
      rightSection={
        draft ? (
          <CloseButton size="sm" onClick={() => handleChange("")} />
        ) : null
      }
      {...props}
    />
  );
};

export default SearchInput;
