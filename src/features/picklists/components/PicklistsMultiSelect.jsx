import { Loader } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { useGetAllPicklistsQuery } from "../../../api/picklist";
import MultiSelect from "../../../components/MultiSelect";

const PicklistsMultiSelect = ({ multiSelectProps = {}, queryObject = {} }) => {
  const picklists = useGetAllPicklistsQuery({ query: queryObject });

  return (
    <MultiSelect
      data={picklists.data}
      tt="capitalize"
      selectLabel="title"
      selectValue="_id"
      placeholder={upperFirst(`select picklists`)}
      rightSection={picklists.isLoading && <Loader size={18} />}
      {...multiSelectProps}
      {...(picklists.isError && { disabled: true, placeholder: "Error loading picklists" })}
    />
  );
};

export default PicklistsMultiSelect;
