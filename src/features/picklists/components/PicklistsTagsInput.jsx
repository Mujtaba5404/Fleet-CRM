import { Loader } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { useGetAllPicklistsQuery } from "src/api/picklist";
import TagsInput from "src/components/TagsInput";

const PicklistsTagsInput = ({ tagsInputProps = {}, queryObject = {} }) => {
  const picklists = useGetAllPicklistsQuery({ query: queryObject });

  return (
    <TagsInput
      data={picklists.data}
      tt="capitalize"
      selectLabel="_id"
      placeholder={upperFirst("select from options or type your own")}
      rightSection={picklists.isLoading && <Loader size={18} />}
      {...(picklists.isError && { disabled: true, placeholder: "Error loading picklists" })}
      {...tagsInputProps}
    />
  );
};

export default PicklistsTagsInput;
