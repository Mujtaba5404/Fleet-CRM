import { Loader } from "@mantine/core";
import { useGetAllPicklistsQuery } from "../../../api/picklist";
import Select from "../../../components/Select";

const PicklistsSelect = ({ selectProps = {}, queryObject = {} }) => {
  const picklists = useGetAllPicklistsQuery({ query: queryObject });

  return (
    <Select
      data={picklists.data}
      tt="capitalize"
      selectLabel="title"
      selectValue="_id"
      rightSection={picklists.isLoading && <Loader size={18} />}
      {...selectProps}
      {...(picklists.isError && {
        disabled: true,
        placeholder: "Error loading picklists",
      })}
    />
  );
};

export default PicklistsSelect;
